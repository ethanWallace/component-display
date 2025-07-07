import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'component-display',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: '../node_modules/@cdssnc/gcds-components/dist/gcds',
          dest: 'gcds',
        },
      ],
    },
  ],
  extras: {
    enableImportInjection: true,
    experimentalSlotFixes: true,
  },
  testing: {
    browserHeadless: 'shell',
  },
  rollupPlugins: {
    after: [nodePolyfills()],
  },
};
