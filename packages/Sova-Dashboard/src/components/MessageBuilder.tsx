import { component$, useStore } from '@qwik.dev/core';
import { APIMessageTopLevelComponent, ComponentType } from 'discord-api-types/payloads/v10';
import { SelectMenu, Toggle } from '@luminescent/ui-qwik';
import Image from 'lucide-icons-qwik/icons/Image';
import Plus from 'lucide-icons-qwik/icons/Plus';
import Trash from 'lucide-icons-qwik/icons/Trash';
import { MediaGalleryBuilder, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from '@discordjs/builders';

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
      <div class="lum-card">
        {messageStore.components.map((component, index) => <div key={index} class="flex items-center gap-2">
          {component.type === ComponentType.TextDisplay && <>
            <textarea class="lum-input whitespace-pre-wrap flex-1" key={index} value={component.content} placeholder="Text Content" onChange$={(e, el) => {
              component.content = el.value;
            }} />
            <button class="lum-btn lum-bg-transparent hover:lum-bg-red-500" onClick$={() => {
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
            <textarea class="lum-input whitespace-pre-wrap flex-1" key={index} value={component.components[0].content} placeholder="Text Content" onChange$={(e, el) => {
              component.components[0].content = el.value;
            }} />
            <div class="flex flex-col gap-1 flex-1">
              <input class="lum-input" value={component.accessory.description} placeholder="Image Description" onChange$={(e, el) => {
                if ('description' in component.accessory) {
                  component.accessory.description = el.value;
                }
              }} />
              <input class="lum-input" value={component.accessory.media.url} placeholder="Image URL" onChange$={(e, el) => {
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
              <input class="lum-input" value={item.description} placeholder="Image Description" onChange$={(e, el) => {
                item.description = el.value;
              }} />
              <input class="lum-input" value={item.media.url} placeholder="Image URL" onChange$={(e, el) => {
                item.media.url = el.value;
              }} />
            </div>)}
            <button class="lum-btn lum-bg-transparent hover:lum-bg-red-500" onClick$={() => {
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
          <button class="lum-btn lum-bg-transparent hover:lum-bg-red-500" onClick$={() => {
            messageStore.components.splice(index, 1);
          }}>
            <Trash size={20} />
          </button>
        </div>)}
        <div class="flex items-center gap-4 mt-4">
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
      </div>

      <div class="flex lum-bg-neutral-950 rounded-lum">
        <div class={{
          'p-4 rounded flex flex-col': true,
          'bg-gray-800 border-2 border-gray-600': messageStore.container,
        }}>
          {messageStore.components.map((component, index) => {
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
    </div>
  );
});