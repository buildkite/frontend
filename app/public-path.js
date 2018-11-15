/* global __webpack_public_path__:true */
/* exported __webpack_public_path__ */

// Allow overriding the webpack public path
// Must be done in a module so that it is executed before all other imports.
// See https://webpack.js.org/guides/public-path/#on-the-fly
if (window._frontendPublicPath) {
  __webpack_public_path__ = window._frontendPublicPath;
}
