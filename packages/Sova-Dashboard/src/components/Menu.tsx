import { component$, Slot } from '@qwik.dev/core';

export default component$(() => {
  return (
    <aside class="hidden sm:flex flex-col sticky max-h-180 top-0 pt-35 sm:pt-25 pl-4 sm:pl-6 pr-2 sm:pr-3" aria-label="Sidebar">
      <div class={{
        'motion-safe:transition-all lum-card lum-bg-gray-900/50 gap-2 p-6 font-futura': true,
      }}>
        <Slot />
      </div>
    </aside>
  );
});

export const MenuCategory = component$(() => {
  return (
    <div class="flex flex-col gap-2">
      <Slot name="name" />
      <div class={{
        'flex flex-col gap-1 flex-wrap': true,
      }}>
        <Slot />
      </div>
    </div>
  );
});

export const MobileMenu = component$(() => {
  return (
    <div class="sm:hidden fixed top-18 z-10 w-[calc(100vw-2rem)] mx-4 lum-card flex-row gap-1 *:lum-btn *:rounded-lum-1 p-1 overflow-auto font-futura backdrop-blur-md">
      <Slot />
    </div>
  );
});