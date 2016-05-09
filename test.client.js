/*global require window*/

// this script is run through karma (see npm test).

// Require babel polyfill for browser.
require('babel-polyfill');

window.JS_ENV = 'client';
window.DESIGN = false;

[
  require.context('./shared/lib', true, /^((?!test\.js$).)*\.js$/),
  require.context('./shared/components', true, /^((?!test\.js$).)*\.js$/),
  require.context('./client/models', true, /^((?!test\.js$).)*\.js$/),
  require.context('./client', true, /\.test\.js$/),
  require.context('./shared', true, /\.test\.js$/)
].forEach((context)=>{
  context.keys().forEach(context);
});
