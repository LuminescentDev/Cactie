import { component$, useStore, useVisibleTask$ } from '@qwik.dev/core';
import { DocumentHead, Link, routeLoader$ } from '@qwik.dev/router';
import { getBotAndUserGuilds } from '~/utils/discord';
import { getSessionFn } from '~/utils/auth';

// returns guilds with mutual property indicating if the bot is in the guild or not
export const useGuilds = routeLoader$(async (requestEvent) => {
  const session = await getSessionFn(requestEvent);
  const { redirect } = requestEvent;
  if (!session) throw redirect(302, '/login');

  const guilds = await getBotAndUserGuilds(session.accessToken, requestEvent);
  if (guilds instanceof Error) {
    console.error(guilds);
    throw redirect(302, `/?error=${encodeURIComponent(guilds.message)}`);
  }
  return guilds;
});

export default component$(() => {
  const guilds = useGuilds().value;
  const store = useStore({
    dev: undefined as boolean | undefined,
    GuildList: guilds,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    store.dev = document.cookie.includes('branch=dev');
  });

  return (
    <section class="flex flex-col mx-auto max-w-6xl px-6 items-center justify-center min-h-svh pt-32"
      style={{
        '--lum-border-radius': '3rem',
      }}>
      <div class="text-center">
        <h1 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-3xl/9 sm:text-5xl/14 md:text-6xl/18 motion-safe:slide-in-from-top-16 animate-in fade-in motion-safe:anim-duration-600">
          Select a Server
        </h1>
        <p class="tracking-tight font-light text-xl/8 md:text-2xl/10 xl:text-3xl/12 animate-in fade-in motion-safe:slide-in-from-top-16 motion-safe:anim-duration-800 drop-shadow-md text-lum-text-secondary">
          to open the dashboard for
        </p>
      </div>
      <div class="flex gap-4 flex-row mt-6 flex-wrap justify-center">
        {
          store.GuildList.filter(guild => guild.mutual).map(guild => {
            const guildIcon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : 'https://cdn.discordapp.com/embed/avatars/0.png';
            return (
              <Link key={guild.id} href={`/dashboard/${guild.id}`}
                class="lum-card p-6 gap-4 relative w-36 sm:w-56 lum-bg-transparent will-change-transform hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-200"
              >
                <img class="absolute inset-0 -z-10 my-auto saturate-200 rounded-lum w-full h-full border border-black object-cover"
                  src={guildIcon}
                  alt={guild.name}
                  width={400}
                  height={400}
                />
                <div class="absolute inset-0 -z-10 backdrop-blur-lg lum-grad-bg-gray-950/80 rounded-lum"/>
                <div class="lum-bg-white/0 rounded-lum-4">
                  <img src={guildIcon}
                    alt={guild.name} class="rounded-lum-4"
                    width={256} height={256}/>
                </div>
                <p class="mt-4 mx-1 mb-2 text-xl tracking-tighter overflow-hidden text-center text-ellipsis sm:line-clamp-1 text-slate-50">{guild.name}</p>
              </Link>
            );
          })
        }
      </div>
      {store.GuildList.filter(guild => !guild.mutual).length > 0 && <>
        <div class="text-center mt-16">
          <h2 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-2xl/9 sm:text-4xl/14 md:text-5xl/18 motion-safe:slide-in-from-top-16 animate-in fade-in motion-safe:anim-duration-600">
            More Servers
          </h2>
          <p class="tracking-tight font-light text-lg/8 md:text-xl/10 xl:text-2xl/12 animate-in fade-in motion-safe:slide-in-from-top-16 motion-safe:anim-duration-800 drop-shadow-md text-lum-text-secondary">
            These servers don't have Sova yet! Select a server to invite Sova to.
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-2 mt-6 ">
          {
            store.GuildList.filter(guild => !guild.mutual).map(guild => {
              const guildIcon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : 'https://cdn.discordapp.com/embed/avatars/0.png';
              return (
                <Link key={guild.id} href={`/invite?guild=${guild.id}`}
                  class="lum-card flex-row items-center p-2 gap-4 relative lum-bg-transparent will-change-transform hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-200"
                >
                  <img class="absolute inset-0 -z-10 my-auto saturate-200 rounded-lum w-full h-full border-2 border-black object-cover"
                    src={guildIcon}
                    alt={guild.name}
                    width={400}
                    height={400}
                  />
                  <div class="absolute inset-0 -z-10 backdrop-blur-lg lum-grad-bg-gray-950/80 rounded-lum"/>
                  <div class="lum-bg-white/0 rounded-lum-2">
                    <img src={guildIcon}
                      alt={guild.name} class="rounded-lum-2"
                      width={64} height={64}/>
                  </div>
                  <p class="pr-4 text-xl tracking-tighter overflow-hidden text-center text-ellipsis sm:line-clamp-1 text-slate-50">{guild.name}</p>
                </Link>
              );
            })
          }
        </div>
      </>}
    </section>
  );
});

export const head: DocumentHead = {
  title: 'Dashboard',
  meta: [
    {
      name: 'description',
      content: 'The Sova Dashboard',
    },
    {
      property: 'og:description',
      content: 'The Sova Dashboard',
    },
  ],
};