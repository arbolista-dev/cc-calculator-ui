/* global document Promise console*/

import React from 'react';
import ReactDOM from 'react-dom';
import XHR from 'i18next-xhr-backend';
import { fromJS } from 'immutable';

import ApplicationComponent from './components/application/application.component';
import StateManager from './lib/state_manager/state_manager';
import Router from './lib/router/router';
import i18nFactory from './lib/i18n/i18nFactory';

function setTranslations() {
  return new Promise((resolve, reject) => {
    try {
      const i18n = i18nFactory('', XHR, () => {
        const language = Router.locale() || i18n.language;
        if (language && language !== i18n.language) {
          i18n.changeLanguage(language, () => { resolve(i18n); });
        } else {
          resolve(i18n);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

// Pass in an instance of ReactJs History function - with either browser or hash history.
export default function (createHistory) {
  const state_manager = new StateManager();
  let router;
  let i18n;

  setTranslations()
    .then((_i18n) => {
      i18n = _i18n;
      router = new Router(i18n);
    })
    .then(() => {
      const location = Router.currentWindowLocation();
      const initial_location_state = fromJS(router.parseLocation(location));
      const initial_state = state_manager.initialState({
        location: initial_location_state,
      });
      return state_manager.initializeStore(initial_state);
    })
    .then(() => {
      const initial_props = {
        state_manager,
        router,
        createHistory,
        i18n,
      };
      ReactDOM.render(
        React.createElement(ApplicationComponent, initial_props),
        document.getElementById('root'));
    })
    .catch((err) => {
      console.error(err.stack);
    });
}
