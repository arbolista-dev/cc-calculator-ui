# babel-plugin-react-templates

[![Build Status](https://travis-ci.org/arbolista-dev/babel-plugin-react-templates.svg?branch=master)](https://travis-ci.org/arbolista-dev/babel-plugin-react-templates)

Import your React Templates with Babel for server side rendering.

## Installation

```sh
$ npm install babel-plugin-react-templates
```

## Usage

### Options

Plugin options are passed to `reactTemplates.convertTemplateToReact`.

There is also an `ext` option for you to specify the extension you want to be compiled by React Templates (the default is `rt.html`).

### `.babelrc`

**.babelrc**

```json
{
  "presets": ["es2015"],
  "plugins": ["react-templates", {"targetVersion": "0.14.0", "ext": "template.html"}]
}
```

This plugin does requires Babel ES2015 preset.

## Examples

This Babel plugin requires you to import your template dependencies BEFORE your templates. For example,

```js
import template from './my_component.template.html';

class MyComponent extends React.Component{
  // ...
  render(){
    return template.call(this);
  }
  // ...
}

```

OR

```js
let template = require('./my_component.template.html');

class MyComponent extends React.Component{
  // ...
  render(){
    return template.call(this);
  }
  // ...
}

```

## Compilation

Currently, the plugin will take a template such as `my_component/my_component.template.html' and write the compiled template to `my_component/_my_component.template.js'. It then does the Babel transformations to import this file instead of the html file.

## Improvements Needed

Babel will not watch your `template.html` files - that is, if you make a change to your html template, `babel-node` will not recompile the template.

Two work arounds for this current:

1. In development and testing, run your scripts with `BABEL_DISABLE_CACHE=1`.
2. Force Babel to compile your changes by making a change to your component file (ie the file that requires the template).

