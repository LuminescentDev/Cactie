import { component$ } from '@qwik.dev/core';
import { DocumentHead, routeLoader$ } from '@qwik.dev/router';
import { getGuild } from '~/utils/discord';

export const useGuild = routeLoader$(async (props) => await getGuild(props));
export default component$(() => {
  const guildData = useGuild().value;
  const { guild, channels, roles } = guildData;

  return (
    <section class="mx-auto max-w-5xl px-6 flex flex-col gap-4 items-center min-h-svh pt-32">
      <h1 class="flex items-center gap-5 font-bold text-white text-2xl sm:text-3xl md:text-4xl">
        {guild.icon && <img class="w-16 h-16 rounded-full" width={64} height={64} src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} alt={guild.name} />}
        {guild.name}
      </h1>
      <div class="w-full">
        <div>
          <p>
            Server Info
          </p>
          <div class="grid sm:grid-cols-2 gap-4">
            <p>
              Id: {guild.id}
            </p>
            <p>
              Channels: {channels.length}
            </p>
            <p>
              Online Members: {guild.approximate_presence_count} / {guild.approximate_member_count}
            </p>
            <p>
              Roles: {roles.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: 'Dashboard',
  meta: [
    {
      name: 'description',
      content: 'The Cactie Dashboard',
    },
    {
      property: 'og:description',
      content: 'The Cactie Dashboard',
    },
  ],
};