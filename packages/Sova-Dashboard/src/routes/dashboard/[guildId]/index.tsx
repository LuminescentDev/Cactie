import { component$, useSignal, useStore } from '@qwik.dev/core';
import { DocumentHead, routeLoader$ } from '@qwik.dev/router';
import { getGuild } from '~/utils/discord';
import Menu, { MenuCategory, MobileMenu } from '~/components/Menu';

import AtSign from 'lucide-icons-qwik/icons/AtSign';
import Code from 'lucide-icons-qwik/icons/Code';
import DoorClosed from 'lucide-icons-qwik/icons/DoorClosed';
import DoorOpen from 'lucide-icons-qwik/icons/DoorOpen';
import Folder from 'lucide-icons-qwik/icons/Folder';
import Hash from 'lucide-icons-qwik/icons/Hash';
import Logs from 'lucide-icons-qwik/icons/Logs';
import Mic from 'lucide-icons-qwik/icons/Mic';
import Plus from 'lucide-icons-qwik/icons/Plus';
import Puzzle from 'lucide-icons-qwik/icons/Puzzle';
import Settings from 'lucide-icons-qwik/icons/Settings';
import User2 from 'lucide-icons-qwik/icons/User2';
import Terminal from 'lucide-icons-qwik/icons/Terminal';
import Ticket from 'lucide-icons-qwik/icons/Ticket';
import Tags from 'lucide-icons-qwik/icons/Tags';
import X from 'lucide-icons-qwik/icons/X';
import MessageBuilder from '~/components/MessageBuilder';
import { APIMessageTopLevelComponent } from 'discord-api-types/payloads/v10';

const General = component$(() => {
  return (
    <>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#join-message">
        <DoorOpen size={20} />
        Join Message
      </a>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#leave-message">
        <DoorClosed size={20} />
        Leave Message
      </a>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#leave-message">
        <Mic size={20} />
        Custom Voice Chats
      </a>
    </>
  );
});

const Tickets = component$(() => {
  return (
    <>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#tickets-channel-name">
        <Hash size={20} />
        Channel Name
      </a>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#tickets-transcripts">
        <Folder size={20} />
        Category
      </a>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#tickets-access-role">
        <AtSign size={20} />
        Access Role
      </a>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#tickets-ping-on-creation">
        <AtSign size={20} />
        Ping on Creation
      </a>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#tickets-transcripts">
        <Logs size={20} />
        Transcripts
      </a>
    </>
  );
});

const AuditLogs = component$(() => {
  return (
    <>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#audit-logs">
        <Plus size={20} />
        Add
      </a>
    </>
  );
});

const CustomCommands = component$(() => {
  return (
    <>
      <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#custom-commands">
        <Plus size={20} />
        Add
      </a>
    </>
  );
});

export const useGuild = routeLoader$(async (props) => await getGuild(props));
export default component$(() => {
  const guildData = useGuild().value;
  const { guild, channels, roles, settings } = guildData;
  const modalRef = useSignal<HTMLDialogElement>();
  const settingsStore = useStore(settings);

  const messageComponents = useSignal<APIMessageTopLevelComponent[]>([]);

  return (
    <section class="grid gap-2 sm:grid-cols-3 lg:grid-cols-4 mx-auto max-w-7xl min-h-svh">
      <MobileMenu>
        <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#general">
          <Settings size={20} />
          General
        </a>
        <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#tickets">
          <Ticket size={20} />
          Tickets
        </a>
        <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#audit-logs">
          <Logs size={20} />
          Audit Logs
        </a>
        <a class="lum-btn lum-bg-transparent rounded-lum-2" href="#custom-commands">
          <Terminal size={20} />
          Custom Commands
        </a>
      </MobileMenu>
      <Menu>
        <MenuCategory>
          <div q:slot="name" class="flex items-center gap-2 px-2 py-2 border-b border-gray-700">
            <Settings size={24} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-1 rounded" />
            <p class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-lg">
              General
            </p>
          </div>
          <General />
        </MenuCategory>
        <MenuCategory>
          <div q:slot="name" class="flex items-center gap-2 px-2 py-2 border-b border-gray-700">
            <Ticket size={24} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-1 rounded" />
            <p class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-lg">
              Tickets
            </p>
          </div>
          <Tickets />
        </MenuCategory>
        <MenuCategory>
          <div q:slot="name" class="flex items-center gap-2 px-2 py-2 border-b border-gray-700">
            <Logs size={24} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-1 rounded" />
            <p class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-lg">
              Audit Logs
            </p>
          </div>
          <AuditLogs />
        </MenuCategory>
        <MenuCategory>
          <div q:slot="name" class="flex items-center gap-2 px-2 py-2 border-b border-gray-700">
            <Terminal size={24} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-1 rounded" />
            <p class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-lg">
              Custom Commands
            </p>
          </div>
          <CustomCommands />
        </MenuCategory>
      </Menu>
      <div class="sm:col-span-2 lg:col-span-3 pt-35 sm:pt-25 pr-4 sm:pr-6 pl-2 sm:pl-3">

        <div
          class="lum-card relative lum-bg-transparent"
        >
          <img class="absolute inset-0 -z-10 my-auto saturate-200 rounded-lum w-full h-full border-2 border-black object-cover"
            src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
            alt={guild.name}
            width={400}
            height={400}
          />
          <div class="absolute inset-0 -z-10 backdrop-blur-lg lum-grad-bg-gray-950/80 rounded-lum"/>

          <div class="flex flex-row items-center gap-6">
            <div class="lum-bg-white/0 rounded-lum-4">
              <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
                alt={guild.name} class="rounded-lum-4"
                width={64} height={64}/>
            </div>
            <h1 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-2xl/9 sm:text-4xl/14 md:text-5xl/18">
              {guild.name}
            </h1>
          </div>

          <div class="grid sm:grid-cols-2 gap-2">
            <div class="p-2">
              <p class="flex items-center gap-2 font-bold">
                <Code size={20} />
                ID
              </p>
              <p>
                {guild.id}
              </p>
            </div>
            <div class="p-2">
              <p class="flex items-center gap-2 font-bold">
                <Hash size={20} />
                Channels
              </p>
              <p>
                {channels.length}
              </p>
            </div>
            <div class="p-2">
              <p class="flex items-center gap-2 font-bold">
                <User2 size={20} />
                Online Members
              </p>
              <p>
                {guild.approximate_presence_count} / {guild.approximate_member_count}
              </p>
            </div>
            <div class="p-2">
              <p class="flex items-center gap-2 font-bold">
                <Tags size={20} />
                Roles
              </p>
              <p>
                {roles.length}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 pb-4 mt-5 mb-5 border-b border-gray-700" id="general">
          <Settings size={48} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-2 rounded-lum" />
          <h2 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-xl sm:text-2xl md:text-3xl">
            General
          </h2>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="lum-card" id="join-message">
            <div class="flex items-center gap-3 px-2 pb-4 border-b border-gray-700">
              <DoorOpen size={30} />
              <h3 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-lg sm:text-xl md:text-2xl">
                Join Message
              </h3>
            </div>
            <div class="flex">
              <button class="lum-btn rounded-lum-2" onClick$={() => {
                messageComponents.value = settingsStore.LeaveJoinMessage.join.message?.components ?? [];
                modalRef.value?.showModal();
              }}>
                <Puzzle size={20} />
                Open Message Builder
              </button>
            </div>
          </div>
          <div class="lum-card" id="leave-message">
            <div class="flex items-center gap-3 px-2 pb-4 border-b border-gray-700">
              <DoorClosed size={30} />
              <h3 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-lg sm:text-xl md:text-2xl">
                Leave Message
              </h3>
            </div>
            <div class="flex">
              <button class="lum-btn rounded-lum-2" onClick$={() => {
                messageComponents.value = settingsStore.LeaveJoinMessage.join.message?.components ?? [];
                modalRef.value?.showModal();
              }}>
                <Puzzle size={20} />
                Open Message Builder
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4 pb-4 mt-5 mb-5 border-b border-gray-700" id="tickets">
          <Ticket size={48} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-2 rounded-lum" />
          <h2 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-xl sm:text-2xl md:text-3xl">
            Tickets
          </h2>
        </div>

        <div class="flex items-center gap-4 pb-4 mt-5 mb-5 border-b border-gray-700" id="audit-logs">
          <Logs size={48} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-2 rounded-lum" />
          <h2 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-xl sm:text-2xl md:text-3xl">
            Audit Logs
          </h2>
        </div>

        <div class="flex items-center gap-4 pb-4 mt-5 mb-5 border-b border-gray-700" id="custom-commands">
          <Terminal size={48} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-2 rounded-lum" />
          <h2 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-xl sm:text-2xl md:text-3xl">
            Custom Commands
          </h2>
        </div>

      </div>

      <dialog ref={modalRef}
        class={{
          'm-auto hidden open:flex text-lum-text lum-card lum-bg-gray-950/80 backdrop-blur-xl': true,
          'open:animate-in open:fade-in open:slide-in-from-top-8 open:anim-duration-300': true,
          'animate-out fade-out slide-in-from-top-8 anim-duration-300': true,
        }}>
        <div class="flex items-center gap-4 mb-6">
          <Puzzle size={40} class="bg-linear-to-t from-purple-200/20 to-blue-200/20 p-2 rounded-lum" />
          <h2 class="font-semibold tracking-tighter text-transparent bg-clip-text! bg-linear-to-t from-purple-200 to-blue-200 text-xl sm:text-2xl md:text-3xl">
            Message Builder
          </h2>
          <button class="lum-btn lum-bg-transparent hover:lum-bg-red-500 absolute top-4 right-4" onClick$={() => {
            modalRef.value?.close();
          }}>
            <X size={20} />
          </button>
        </div>
        <MessageBuilder components={messageComponents.value} />
      </dialog>
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