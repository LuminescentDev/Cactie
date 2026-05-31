import { component$ } from '@qwik.dev/core';
import { Link } from '@qwik.dev/router';
import { Nav } from '@luminescent/ui-qwik';
import SiGithub from 'simple-icons-qwik/icons/SiGithub';
import SiDiscord from 'simple-icons-qwik/icons/SiDiscord';
import AppWindow from 'lucide-icons-qwik/icons/AppWindow';
import Sparkles from 'lucide-icons-qwik/icons/Sparkles';
import Sova from './images/Sova';

export default component$(() => {
  return (
    <Nav floating fixed colorClass="lum-bg-nav-bg !text-lum-text">
      <Link q:slot="start" href="/" class="lum-btn lum-bg-transparent hover:lum-bg-nav-bg rounded-lum-2">
        <Sova size={20} />
        Sova
      </Link>

      <Link q:slot="center" href="/dashboard" class="lum-btn lum-bg-transparent hover:lum-bg-nav-bg hidden sm:flex rounded-lum-2">
        <AppWindow size={20} /> Dashboard (coming soon)
      </Link>
      <Link q:slot="end" href="/invite" class="lum-btn lum-bg-transparent hover:lum-bg-nav-bg hidden sm:flex rounded-lum-2">
        <Sparkles size={20} /> Invite
      </Link>
      <div q:slot="end" class="hidden gap-2 sm:flex">
        <SocialButtons />
      </div>

      <div q:slot="mobile" class="flex justify-evenly">
        <SocialButtons />
      </div>
    </Nav>
  );
});

export const SocialButtons = component$(({ large }: { large?: boolean }) => {
  return <>
    <a
      href="https://github.com/saboooor/Cactie"
      title="GitHub"
      class={{
        'lum-btn lum-bg-transparent hover:lum-bg-nav-bg fill-current': true,
        'p-3': large,
        'rounded-lum-2 p-2': !large,
      }}
    >
      <SiGithub size={large ? 32 : 20} />
    </a>
    <a
      href="/discord"
      title="Discord"
      class={{
        'lum-btn lum-bg-transparent hover:lum-bg-nav-bg fill-current': true,
        'p-3': large,
        'rounded-lum-2 p-2': !large,
      }}
    >
      <SiDiscord size={large ? 32 : 20} />
    </a>
  </>;
});