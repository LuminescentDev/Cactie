import { component$ } from '@qwik.dev/core';
import { type DocumentHead } from '@qwik.dev/router';

import Sparkles from 'lucide-icons-qwik/icons/Sparkles';
import SiDiscord from 'simple-icons-qwik/icons/SiDiscord';

export default component$(() => {
  return (
    <section class="min-h-svh flex justify-center relative overflow-hidden">
      <div id="hero" class="flex flex-col gap-24 md:flex-row text-gray-100 px-20 items-center justify-center md:justify-between pt-18 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl w-full">
        <div class="relative flex flex-col gap-4 xl:gap-8">
          <h1 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-3xl/9 sm:text-5xl/14 md:text-6xl/18 motion-safe:slide-in-from-top-16 animate-in fade-in motion-safe:anim-duration-600">
            The only{' '}
            <span class="text-transparent bg-clip-text! bg-linear-to-br from-indigo-500 to-blue-100">
              Discord
            </span>{' '}
            bot
            <br/>
            you need,{' '}
            <span class="text-transparent bg-clip-text! bg-linear-to-br from-sky-400 to-purple-600">
              Sova
            </span>.
          </h1>
          <h2 class="tracking-tight font-light text-xl/8 md:text-2xl/10 xl:text-3xl/12 animate-in fade-in motion-safe:slide-in-from-top-16 motion-safe:anim-duration-800 drop-shadow-md text-lum-text-secondary">
            A multipurpose bot with a focus on moderation, utility, and fun. With a wide range of features and an easy-to-use interface, Sova is the perfect addition to any Discord server.
          </h2>
        </div>
        <div class="flex flex-col gap-2 mt-8">
          <a href="/invite" target="_blank"
            class="lum-btn lum-btn-p-4 xl:lum-btn-p-6 text-xl lum-grad-bg-purple-600/40 hover:lum-bg-purple-700 animate-in fade-in motion-safe:slide-in-from-top-16 motion-safe:anim-duration-600">
            <Sparkles size={32} /> Invite Sova
          </a>
          <a href="/discord" target="_blank"
            class="lum-btn lum-btn-p-4 fill-current xl:lum-btn-p-6 text-xl lum-grad-bg-indigo-600/40 hover:lum-bg-indigo-700 animate-in fade-in motion-safe:slide-in-from-top-16 motion-safe:anim-duration-800">
            <SiDiscord size={32} /> Support Server
          </a>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: 'Sova is a multipurpose bot with a focus on moderation, utility, and fun. With a wide range of features and an easy-to-use interface, Sova is the perfect addition to any Discord server.',
    },
    {
      property: 'og:description',
      content: 'Sova is a multipurpose bot with a focus on moderation, utility, and fun. With a wide range of features and an easy-to-use interface, Sova is the perfect addition to any Discord server.',
    },
  ],
};