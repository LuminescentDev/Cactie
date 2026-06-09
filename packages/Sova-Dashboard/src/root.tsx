import { component$ } from '@qwik.dev/core';
import {
  QwikRouterProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@qwik.dev/router';
import { RouterHead } from './components/Head';

import './global.css';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikRouterProvider>
      <head>
        <meta charset='utf-8' />
        <link rel='manifest' href='/manifest.json' />
        <RouterHead />
      </head>
      <body class='text-gray-200'>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikRouterProvider>
  );
});