/* global __webpack_public_path__:true */
/* exported __webpack_public_path__ */

// Allow specifying the webpack public path
//
// When running webpack dev server in development it provides a public path,
// and we should use it.
//
// Must be done in a module so that it is executed before all other imports.
//
// See https://webpack.js.org/guides/public-path/#on-the-fly
if (__webpack_public_path__ === "" && window._frontendPublicPath) {
  __webpack_public_path__ = window._frontendPublicPath;
}
