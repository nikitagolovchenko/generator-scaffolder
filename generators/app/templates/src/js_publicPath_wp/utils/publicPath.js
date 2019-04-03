/* eslint-disable */

const STATIC_CHUNK_PATH = 'js/';
const DYNAMIC_CHUNK_PATH = window.pathInfo;

if (DYNAMIC_CHUNK_PATH !== undefined) {
  __webpack_public_path__ = `${DYNAMIC_CHUNK_PATH.base}${DYNAMIC_CHUNK_PATH.js}`;
} else {
  __webpack_public_path__ = STATIC_CHUNK_PATH;
}

/* eslint-enable */
