import { component$, useStore } from '@qwik.dev/core';
import { APIMessageTopLevelComponent, ComponentType } from 'discord-api-types/payloads/v10';
import { SelectMenu, Toggle } from '@luminescent/ui-qwik';
import Check from 'lucide-icons-qwik/icons/Check';
import Image from 'lucide-icons-qwik/icons/Image';
import Plus from 'lucide-icons-qwik/icons/Plus';
import Trash from 'lucide-icons-qwik/icons/Trash';
import { MediaGalleryBuilder, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from '@discordjs/builders';
import Sova from './images/Sova';

export default component$(() => {
  const messageStore = useStore<{
    container: boolean;
    components: APIMessageTopLevelComponent[];
  }>({
    container: false,
    components: [],
  });

  return (
    <div class="flex gap-8">
      <div class="lum-card p-2">
        <div class="flex items-center gap-4">
          <SelectMenu customDropdown class="lum-bg-transparent">
            <span q:slot="dropdown" class="flex items-center gap-2">
              <Plus size={20} />
              Add Component
            </span>
            <button q:slot="extra-buttons" class="lum-btn" onClick$={() => {
              messageStore.components.push(
                new TextDisplayBuilder()
                  .setContent('Hello, World!')
                  .toJSON(),
              );
            }}>
              Add Text Display Component
            </button>
            <button q:slot="extra-buttons" class="lum-btn" onClick$={() => {
              messageStore.components.push(
                new SeparatorBuilder()
                  .toJSON(),
              );
            }}>
              Add Separator Component
            </button>
            <button q:slot="extra-buttons" class="lum-btn" onClick$={() => {
              messageStore.components.push(
                new MediaGalleryBuilder()
                  .addItems(item => item
                    .setURL('https://media.tenor.com/jUMex_rdqPwAAAAM/among-us-twerk.gif')
                    .setDescription('Placeholder Image'),
                  )
                  .toJSON(),
              );
            }}>
              Add Media Gallery Component
            </button>
          </SelectMenu>
          <Toggle id="container-toggle" checked={messageStore.container} onChange$={(e, el) => {
            messageStore.container = el.checked;
          }}>
            Enable Container
          </Toggle>
        </div>
        {messageStore.components.map((component, index) => <div key={index} class="lum-card lum-bg-gray-800 rounded-lum-2 flex-row p-1 gap-1 items-start">

          {component.type === ComponentType.TextDisplay && <>
            <textarea class="lum-input rounded-lum-3 whitespace-pre-wrap flex-1" key={index} value={component.content} placeholder="Text Content" onInput$={(e, el) => {
              component.content = el.value;
            }} />
            <button class="lum-btn rounded-lum-3 lum-bg-transparent" onClick$={() => {
              messageStore.components[index] = new SectionBuilder()
                .addTextDisplayComponents(textDisplay => textDisplay.setContent(component.content || ''))
                .setThumbnailAccessory(thumbnail => thumbnail
                  .setURL('https://media.tenor.com/jUMex_rdqPwAAAAM/among-us-twerk.gif')
                  .setDescription('Placeholder Image'),
                )
                .toJSON();
            }}>
              <Image size={20} />
              Add Thumbnail
            </button>
          </>}

          {(component.type === ComponentType.Section
              && component.components[0].type === ComponentType.TextDisplay
              && component.accessory?.type === ComponentType.Thumbnail) && <>
            <textarea class="lum-input rounded-lum-3 whitespace-pre-wrap flex-1" key={index} value={component.components[0].content} placeholder="Text Content" onInput$={(e, el) => {
              component.components[0].content = el.value;
            }} />
            <div class="flex flex-col gap-1 flex-1">
              <input class="lum-input rounded-lum-3" value={component.accessory.description} placeholder="Image Description" onInput$={(e, el) => {
                if ('description' in component.accessory) {
                  component.accessory.description = el.value;
                }
              }} />
              <input class="lum-input rounded-lum-3" value={component.accessory.media.url} placeholder="Image URL" onInput$={(e, el) => {
                if ('media' in component.accessory) {
                  component.accessory.media.url = el.value;
                }
              }} />
            </div>
          </>}

          {component.type === ComponentType.Separator && (
            <hr key={index} class="my-4 border-gray-600 flex-1" />
          )}

          {component.type === ComponentType.MediaGallery && <>
            {component.items.map((item, itemIndex) => <div key={itemIndex} class="flex flex-col gap-1 flex-1">
              <input class="lum-input rounded-lum-3" value={item.description} placeholder="Image Description" onInput$={(e, el) => {
                item.description = el.value;
              }} />
              <input class="lum-input rounded-lum-3" value={item.media.url} placeholder="Image URL" onInput$={(e, el) => {
                item.media.url = el.value;
              }} />
            </div>)}
            <button class="lum-btn rounded-lum-3 lum-bg-transparent" onClick$={() => {
              component.items.push({
                media: {
                  url: 'https://media.tenor.com/jUMex_rdqPwAAAAM/among-us-twerk.gif',
                },
                description: 'Placeholder Image',
              });
            }}>
              <Image size={20} />
              Add Image
            </button>
          </>}

          <button class="lum-btn p-2 rounded-lum-3 lum-bg-transparent hover:lum-bg-red-500" onClick$={() => {
            messageStore.components.splice(index, 1);
          }}>
            <Trash size={20} />
          </button>
        </div>)}
      </div>
      <MessagePreview message={{
        author: {
          bot: true,
        },
        components: messageStore.components,
      }} />
    </div>
  );
});

// todo: add support for multiple containers
export const MessagePreview = component$(({ message, container }: {
  message: {
    author?: {
      username?: string;
      bot?: boolean;
    };
    components?: APIMessageTopLevelComponent[];
  };
  container?: boolean;
}) => {
  return <div class="flex lum-bg-discord-600 rounded-lum p-4">
    <Sova width={40} height={40} class="w-10 h-10 mx-2 rounded-full" alt={'Sova'} />
    <div>
      <div class="flex items-center gap-2">
        <p class="font-bold">
          {message.author?.username ?? 'Sova'}
        </p>
        {message.author?.bot &&
          <p class="flex items-center text-sm bg-indigo-500 font-bold px-1.5 rounded-md">
            <Check size={16} strokeWidth={4} /> APP
          </p>
        }
        <p class="text-sm text-gray-400">Today at 12:00 PM</p>
      </div>
      <div class={{
        'rounded-xl flex flex-col': true,
        'bg-discord-500 border border-discord-300 p-4': container,
      }}>
        {message.components?.map((component, index) => {
          if (component.type === ComponentType.TextDisplay) {
            return (
              <p key={index}>
                {component.content}
              </p>
            );
          }
          if (component.type === ComponentType.Section
                && component.components[0].type === ComponentType.TextDisplay
                && component.accessory?.type === ComponentType.Thumbnail) {
            return <div key={index} class="flex items-start gap-4">
              <p key={index} class="flex-1">
                {component.components[0].content}
              </p>
              <img src={component.accessory.media.url} alt={component.accessory.description ?? ''} width={128} height={128} class="w-32 h-32 object-cover rounded" />
            </div>;
          }
          if (component.type === ComponentType.Separator) {
            return (
              <hr key={index} class="my-4 border-gray-600" />
            );
          }
          if (component.type === ComponentType.MediaGallery) {
            return (
              <div key={index} class="flex items-start gap-4 flex-wrap">
                {component.items.map((item, itemIndex) => (
                  <img key={itemIndex} src={item.media.url} alt={item.description ?? ''} height={256} width={256} class="h-64 w-auto rounded" />
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  </div>;
});