# Cool Climate Calculator UI

We will be reimplementing the [Cool Climate Calculator UI](http://coolclimate.berkeley.edu/calculators/household/ui.php).

You can view the designs at [Carbon Calculator Design](https://app.box.com/files/0/f/6491312265/Carbon_Calculator_Design).

## Scripts

Install dependencies with `npm install`. You may need to sudo.


## Developing

To run the Webpack development server,

```sh
npm run develop
```

Go to `localhost:3000` to view app.

Code changes will automatically refresh page. However, to load changes to a particular component template, you must also make a change to the JS component file.

## Production

To run the production Node server in a Docker container, a Docker image needs to be built and the container to be launched:

```sh
docker build -t cc:ui .

(docker stop ui || exit 0) && \
(docker rm ui || exit 0) && \
docker run \
  -d \
  -p 0.0.0.0:3000:3000 \
  --name ui\
  cc:ui
```

Go to `localhost:3000` to view app.

Alternatively the server can be started outside of a Docker container using,
```sh
npm run prod
```

### In Rancher

```sh
(docker stop ui || exit 0) && \
  (docker rm ui || exit 0) && \
  docker run -itd --label io.rancher.container.network=true    \
  --name ui  cc:ui
```

You can then find the container and add to a service.

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

## Architecture

Architecture is based on [AnalyticsFire/spike](https://github.com/AnalyticsFire/spike).

- [React](https://facebook.github.io/react/)
- [React Templates](http://wix.github.io/react-templates/)
- [Redux](https://github.com/reactjs/redux)
- [Immutable.js](https://facebook.github.io/immutable-js/)
- [ReactJs History](https://github.com/mjackson/history) - JS framework agnostic
- [Babel with ES2015 support](https://babeljs.io/docs/learn-es2015/)
- [Bootstrap](http://getbootstrap.com/) and jQuery for UI prototyping.
- [Webpack](https://webpack.github.io/) - for compiling client assets
- [Karma](https://karma-runner.github.io/0.13/index.html) and [Jasmine](http://jasmine.github.io/) for testing
