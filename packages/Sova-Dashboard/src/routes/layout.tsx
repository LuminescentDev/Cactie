import { component$, Slot } from '@qwik.dev/core';
import Sova from '~/components/images/Sova';
import Nav from '~/components/Nav';
import { useSession } from './plugin@auth';

export default component$(() => {
  const session = useSession();

  return (
    <main>
      <Nav session={session} />
      <Slot />
      <div class="absolute inset-0 -z-10 overflow-clip">
        <div class="blur-2xl mt-[-25vh] ml-[10vh]">
          <Sova size={'100vmax'} animated noblur class="opacity-20" />
        </div>
      </div>
    </main>
  );
});
