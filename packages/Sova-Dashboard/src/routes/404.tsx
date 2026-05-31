import { component$ } from '@qwik.dev/core';
import { DocumentHead, Link } from '@qwik.dev/router';
import { Luminescent } from '@luminescent/icons-qwik';

export default component$(() => {
  return (
    <section class="flex flex-col mx-auto max-w-xl px-4 justify-center min-h-[calc(100svh)] pt-24">
      <h1 class="relative text-gray-100 text-3xl sm:text-6xl font-bold animate-in fade-in slide-in-from-top-8 anim-duration-1000">
        <div style="filter: drop-shadow(0 0 3rem #CB6CE6);">
          <div class="font-semibold flex items-center gap-2 sm:gap-5 text-[#f0ccfb] fill-[#f0ccfb] select-none" style="filter: drop-shadow(0 0 5rem #CB6CE6);">
            <Luminescent size={200} class="mt-2 hidden sm:flex" />
            <Luminescent size={100} class="mt-1 flex sm:hidden" />
          </div>
        </div>
      </h1>
      <h1 class="font-bold text-red-500 text-2xl sm:text-5xl mt-16">
        404: Page not found
      </h1>
      <p class="text-lg sm:text-2xl text-gray-400 my-6">
        Whoops! You've hit a dead-end.
      </p>
      <div class="grid sm:flex gap-3 pt-4">
        <Link href="/" class="lum-btn">
          Go back home
        </Link>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: '404: Page not found',
  meta: [
    {
      name: 'description',
      content: 'Whoops! You\'ve hit a dead-end.',
    },
    {
      name: 'og:description',
      content: 'Whoops! You\'ve hit a dead-end.',
    },
    {
      name: 'og:image',
      content: 'https://avatars.githubusercontent.com/u/42164502',
    },
  ],
};