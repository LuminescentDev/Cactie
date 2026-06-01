import { component$, Slot } from '@qwik.dev/core';
import Sova from '~/components/images/Sova';
import Nav from '~/components/Nav';
import { useSession } from './plugin@auth';
import { useLocation } from '@qwik.dev/router';
import { getClassObject } from '@luminescent/ui-qwik';

export default component$(() => {
  const session = useSession();
  const loc = useLocation();

  return (
    <main>
      <Nav session={session} />
      <Slot />
      <div class="absolute inset-0 -z-10 overflow-clip">
        <div class="blur-2xl mt-[-25vh] ml-[10vh]">
          <Sova size={'100vmax'} animated noblur class={getClassObject({
            'opacity-20': !loc.url.pathname.startsWith('/dashboard'),
            'opacity-5': loc.url.pathname.startsWith('/dashboard'),
          })} />
        </div>
      </div>
    </main>
  );
});
