import { component$ } from '@qwik.dev/core';
import type { DocumentHead } from '@qwik.dev/router';

export default component$(() => {
  return (
    <section class="mx-auto max-w-5xl px-6 items-center min-h-[100svh] pt-32">
      <div>
        <h1 class="font-bold text-white text-4xl sm:text-5xl md:text-6xl">
          <span class="text-blue-200" style={{ filter: 'drop-shadow(0 0 3rem rgb(74 222 128));' }}>Privacy</span> Policy / <span class="text-luminescent-200" style={{ filter: 'drop-shadow(0 0 3rem #CB6CE6);' }}>Terms</span> of Use.
        </h1>
        <p class="mt-5 text-lg font-bold text-slate-300">
          As of May 4th, 2024.
        </p>
      </div>
      <div class="mt-5 text-slate-300">
        <p>By using Sova's services in any form you agree to the following privacy policy / terms of use and the storage of necessary functional data.</p>
        <br/>
        <ol class="list-decimal list-inside">
          <li>
            The information that is stored
            <ol>
              <li>Your server's Id for server-specific data such as settings</li>
              <li>User Id for moderation and vote data</li>
              <li>The Id of messages that contain Reaction Roles</li>
              <li>All information set in the <a href="/dashboard" class="underline">dashboard</a></li>
            </ol>
          </li>
          <br/>
          <li>
            Why this information is stored and how its used
            <ol>
              <li>Your server's Id to keep track of which settings are for which server</li>
              <li>User Id if the user has been punished by Sova, it gets deleted when the punishment ends</li>
              <li>The Id of messages that contain Reaction Roles for Sova to match the associated message</li>
              <li>All information set in the <a href="/dashboard" class="underline">dashboard</a> will be deleted if Sova gets removed from the associated server</li>
            </ol>
          </li>
          <br/>
          <li>
            Who gets this stored data?
            <ol>
              <li>Dashboard data is available to members of the server that have the 'Manage Server' permission.</li>
            </ol>
          </li>
          <br/>
        </ol>
        If there is need for troubleshooting or investigating suspected malicious activity, the developer may create an invite to the associated server<br/>
        The invite link is never shared with anyone else to protect your privacy.
      </div>
      <br/><br/>
      <div>
        <h1 class="font-bold text-white text-4xl sm:text-5xl md:text-6xl">
          Licensing <span class="text-luminescent-200" style={{ filter: 'drop-shadow(0 0 3rem #CB6CE6);' }}>Information</span>
        </h1>
        <br/>
        <a class="mt-5 text-2xl underline text-indigo-400" style={{ filter: 'drop-shadow(0 0 3rem rgb(99 102 241));' }} href="https://github.com/saboooor/Sova/blob/master/LICENSE">
          GNU Affero General Public License v3.0
        </a>
      </div>
      <br/><br/>
    </section>
  );
});

export const head: DocumentHead = {
  title: 'Legal',
  meta: [
    {
      name: 'description',
      content: 'Privacy Policy / Terms of Use. GNU Affero General Public License v3.0.',
    },
    {
      property: 'og:description',
      content: 'Privacy Policy / Terms of Use. GNU Affero General Public License v3.0.',
    },
  ],
};