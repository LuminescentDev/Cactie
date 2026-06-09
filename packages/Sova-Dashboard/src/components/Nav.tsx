import { component$ } from '@qwik.dev/core';
import { Link, LoaderSignal } from '@qwik.dev/router';
import { Nav, SelectMenu } from '@luminescent/ui-qwik';
import SiGithub from 'simple-icons-qwik/icons/SiGithub';
import SiDiscord from 'simple-icons-qwik/icons/SiDiscord';
import AppWindow from 'lucide-icons-qwik/icons/AppWindow';
import Sparkles from 'lucide-icons-qwik/icons/Sparkles';
import LogOut from 'lucide-icons-qwik/icons/LogOut';
import Sova from './images/Sova';

export default component$(({ session }: {
  session: LoaderSignal<{
    sessionId: string;
    discordId: string;
    pfp: string | null;
    accent: string | null;
} | null>;
}) => {
  return (
    <Nav floating fixed colorClass="lum-grad-bg-nav-bg !text-lum-text">
      <Link q:slot="start" href="/" class="lum-btn lum-bg-transparent hover:lum-bg-nav-bg rounded-lum-2">
        <Sova size={20} />
        Sova
      </Link>

      {session.value &&
        <Link q:slot="center" href="/dashboard" class="lum-btn lum-bg-transparent hover:lum-bg-nav-bg hidden sm:flex rounded-lum-2">
          <AppWindow size={20} /> Dashboard
        </Link>
      }

      {!session.value &&
        <Link q:slot="end" href="/login" class="lum-btn lum-bg-transparent hover:lum-bg-nav-bg hidden sm:flex rounded-lum-2">
          Login
        </Link>
      }
      {session.value &&
        <SelectMenu id="profile" q:slot='end' class="lum-bg-transparent hover:lum-bg-nav-bg rounded-lum-2" panelClass="lum-bg rounded-lum-1">
          <img q:slot="dropdown" src={session.value?.pfp ?? 'https://cdn.discordapp.com/embed/avatars/0.png'} class="rounded-full min-h-6 max-h-6 min-w-6 max-w-6" width={24} height={24} />
          <Link href="/logout" q:slot="extra-buttons" class="lum-btn lum-bg-transparent hover:lum-bg-nav-bg hidden sm:flex rounded-lum-2">
            <LogOut size={20} />
            Logout
          </Link>
        </SelectMenu>
      }
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
      href="https://github.com/saboooor/Sova"
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