import { RequestEventBase } from '@qwik.dev/router';
import { APIGuild, APIRole, APISortableChannel, PermissionFlagsBits, RESTError, RESTRateLimit } from 'discord-api-types/v10';
import { tursoDb } from './drizzle';
import { settings } from '@sova/drizzle-schema';
import { eq } from 'drizzle-orm/sql/expressions';

export async function fetchData<T>(url: string, props: RequestEventBase, accessToken?: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      authorization: `${accessToken ? `Bearer ${accessToken}` : `Bot ${props.env.get('BOT_TOKEN')}`}`,
    },
  }).catch((err: any) => {
    console.log(err);
  });
  if (!res) throw new Error(`Fetch failed for ${url}`);

  const data: RESTError | RESTRateLimit | any = await res.json();
  if ('retry_after' in data) {
    console.log(`${data.message}, retrying after ${data.retry_after * 1000}ms`);
    await new Promise((r) => setTimeout(r, data.retry_after * 1000));
    return await fetchData<T>(url, props, accessToken);
  }
  if ('code' in data) throw new Error(`${url} error ${data.code}`);

  return data;
}

interface guildData {
  guild: APIGuild,
  channels: APISortableChannel[],
  roles: APIRole[],
}

const guildCache = new Map<string, guildData>();
export async function getGuild(requestEvent: RequestEventBase, noCache?: boolean) {
  const guildId = requestEvent.params.guildId;
  if (!noCache && guildCache.has(guildId)) return guildCache.get(guildId)!;

  console.log('Fetching guild data for', guildId);

  const [guild, channels, roles] = await Promise.all([
    fetchData<APIGuild>(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, requestEvent),
    fetchData<APISortableChannel[]>(`https://discord.com/api/v10/guilds/${guildId}/channels`, requestEvent),
    fetchData<APIRole[]>(`https://discord.com/api/v10/guilds/${guildId}/roles`, requestEvent),
  ]);

  // Sort roles by position
  roles.sort((a, b) => b.position - a.position);
  // Sort channels by position
  channels.sort((a, b) => a.position - b.position);

  guildCache.set(guildId, { guild, channels, roles });

  // Fetch guild settings
  const db = await tursoDb(requestEvent);
  let guildSettings = await db.select()
    .from(settings)
    .where(
      eq(settings.Id, guildId),
    )
    .get();

  if (!guildSettings) {
    // insert settings
    guildSettings = await db.insert(settings).values({
      Id: guildId,
    }).returning();
  }
  return { guild, channels, roles, settings: guildSettings };
}

export async function getBotAndUserGuilds(accessToken: string, requestEvent: RequestEventBase, isDeveloper?: boolean) {
  let GuildList = await fetchData<APIGuild[]>('https://discord.com/api/v10/users/@me/guilds', requestEvent, accessToken);
  if (GuildList instanceof Error) return GuildList;
  const BotGuildList = await fetchData<APIGuild[]>('https://discord.com/api/v10/users/@me/guilds', requestEvent);
  if (BotGuildList instanceof Error) return BotGuildList;

  // filter guilds where user has manage guild permissions
  GuildList = GuildList.filter(guild =>
    (BigInt(guild.permissions!) & PermissionFlagsBits.ManageGuild) === PermissionFlagsBits.ManageGuild,
  );

  // mark mutual guilds
  const GuildWithMutual = GuildList.map(guild => {
    return {
      ...guild,
      mutual: isDeveloper ? true : BotGuildList.some(botguild => botguild.id == guild.id),
    };
  });

  return GuildWithMutual;
};