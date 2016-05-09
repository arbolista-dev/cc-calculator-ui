# Cool Climate Calculator UI

We will be reimplementing the [Cool Climate Calculator UI](http://coolclimate.berkeley.edu/calculators/household/ui.php).

## Goals
- Update design.
- Prioritize mobile design first.
- Improve code base for robustness, modularity, and speed.

## Architectural Dependencies

- [React](https://facebook.github.io/react/)
- [React Templates](http://wix.github.io/react-templates/)
- [ReactJs History](https://github.com/mjackson/history) - JS framework agnostic
- [Babel with ES2015 support](https://babeljs.io/docs/learn-es2015/)
- [Bootstrap](http://getbootstrap.com/) and jQuery for UI prototyping.
- [Webpack](https://webpack.github.io/) - for compiling client assets
- [Karma](https://karma-runner.github.io/0.13/index.html) and [Jasmine](http://jasmine.github.io/) for testing

## Scripts

Install dependencies
```
npm install
```

## Developing

To run the Webpack development server,

```sh
npm run develop
```

## Testing

`npm test` is equivalent to:

```
karma start --single-run
eslint --fix .
```

Karma is used to test client side application interactions.

Jasmine is used to test that the application successfully renders server side for a given URL (using [supertest](https://github.com/visionmedia/supertest) to mock requests).

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

## License

The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice must be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
