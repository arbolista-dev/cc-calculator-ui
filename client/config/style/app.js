/*global require __dirname*/

// include vendor assets first
require('./vendor');

// other css assets.
let cssContext = require.context(__dirname + '/../../../server/assets/css', true, /\.s?css$/);
cssContext.keys().forEach(cssContext);

// component context
let componentContext = require.context(__dirname + '/../../../shared/components', true, /\.s?css$/);
componentContext.keys().forEach(componentContext);
