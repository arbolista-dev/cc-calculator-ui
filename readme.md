# Cool Climate Calculator UI

[![Build Status](https://travis-ci.org/AnalyticsFire/spike.svg?branch=master)](https://travis-ci.org/CoolClimate/cc-calculator-ui)

## Purpose

Spike is collection of Javascript modules, compilers, and libraries intended to ease development of front end applications that interact with web services. Dependencies include:
- [React](https://facebook.github.io/react/)
- [React Templates](http://wix.github.io/react-templates/)
- [ReactJs History](https://github.com/mjackson/history) - JS framework agnostic
- [Babel with ES2015 support](https://babeljs.io/docs/learn-es2015/)
- [Bootstrap](http://getbootstrap.com/) and jQuery for UI prototyping.
- [Webpack](https://webpack.github.io/) - for compiling client assets
- [Karma](https://karma-runner.github.io/0.13/index.html) and [Jasmine](http://jasmine.github.io/) for testing

Spike uses these dependencies to implement the following features within a well defined architecture:
- Polymorphic models and state manager framework to retrieve data on the server or the client.
- Server side rendering on Express server - bypasses initial render and data retrieval on client.
- Client side management of browser history (ie routing).
- Webpack development server for fast and easy development of changes through hot loading.
- Webpack configuration for environment based API calls (see `client/api/{env}`).
- Standalone Webpack builds for offline development of HTML and CSS by designers.
- Karma and Jasmine configurations to test app rendering on both client and server.
- ESLint configuration to ensure consistent code style with Spike base.

## Scripts

Install dependencies
```
npm install
```

## Generating components

Generate component named Super
```
npm run generate -- --component Super
```

This will copy and process a set of files in ./client/config/templates/component
and put it into ./client/components/super directory

To specify a different subdirectory use --destination switch with subdirectory name relative to ./client/components/

```
npm run generate -- --component SubSuper --destination super/sub_super
```

This will generate set of component files inside of ./client/components/super/sub_super/.


## Developing

To run the Webpack development server,

```sh
npm run develop
```

## Testing

`npm test` is equivalent to:

```
BABEL_DISABLE_CACHE=1 karma start --single-run
BABEL_DISABLE_CACHE=1 babel-node test.server.js
eslint --fix .
```

Karma is used to test client side application interactions.

Jasmine is used to test that the application successfully renders server side for a given URL (using [supertest](https://github.com/visionmedia/supertest) to mock requests).

## Design Build

Build the app with webpack:

```sh
npm run build_design
```

The design app requires no backend, just a server so files can be downloaded with jQuery. For instance with Python or Python3:

```
cd client/build/design
python -m SimpleHTTPServer 8000
python3 -m http.server
```

*Note*
In order for the design build to work, every rendered component should have a class level `NAME` which is unique and the same as the name used to import the component in the templates.

## Internationalization

In order to internationalize the component it must inherit from TranslatableComponent.

This parent class provides child components with `t` property that
can be called in templates as `this.t('Some string')` and with `i18next` property that is uninitialized in test environment.

Translations can be found in ./server/assets/translation/{lngCode}.json and it is in following format:

```json
{
  "This is a key to be translated.": "Ovo je ključ koji treba prevesti."
}
```

Setup uses gettext type keys - so if key is missing library will fallback on the key. Translation is turned off in test environments.

Language detection uses URL, and stores information in `lang` cookie.
You can change language by appending `lang=LANGUAGE_CODE` to query string of the URL (eg. `lang=bs`).

## Areas for Improvement

Currently, any changes made to React templates are not seen by Webpack's watcher, so you have to force a change in the React component class for Webpack to load the changes in your template files.

The alternative is to set `cache: false` in the development webpack configuration file. However, this dramatically slows down hot patching.


## License

The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice must be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
