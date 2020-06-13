/* eslint-disable import/prefer-default-export */

import 'normalize.css';

const browserUpdate = require('browser-update/update.npm.js');

browserUpdate({
  required: { e: -2, f: -2, o: -2, s: -2, c: -2 },
  insecure: true,
  api: 2019.11,
});

export { default as wrapRootElement } from './src/wrap-root-element';
export { default as wrapPageElement } from './src/wrap-page-element';
