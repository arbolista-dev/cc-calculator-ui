/*global document window Promise console*/

import React from 'react';
import ReactDOM from 'react-dom';
import XHR from 'i18next-xhr-backend';
import { fromJS } from 'immutable';

import ApplicationComponent from './components/application/application.component';
import StateManager from './lib/state_manager/state_manager';
import Router from './lib/router/router';
import i18nFactory from './lib/i18n/i18nFactory';

function setTranslations(){
  return new Promise((resolve, reject) => {
    try {
      let i18n = i18nFactory('', XHR, ()=>{
        let language = Router.locale() || i18n.language;
        if (language && language !== i18n.language) {
          i18n.changeLanguage(language, ()=>{ resolve(i18n) });
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
export default function(createHistory) {

  var state_manager = new StateManager(),
      router, i18n;

  setTranslations()
    .then((_i18n)=>{
      i18n = _i18n;
      router = new Router(i18n);
      return state_manager.getInitialData();
    })
    .then(()=>{
      let location = Router.currentWindowLocation(),
          initial_location_state = fromJS(router.parseLocation(location)),
          initial_state = state_manager.initialState({
            location: initial_location_state
          });
      console.log('currentWindowLocation: ', location);
      console.log('initial_location_state: ', initial_location_state);
      console.log('initial_state: ', initial_state);
      return state_manager.initializeStore(initial_state);
    })
    .then(() => {
      var initial_props = {
        state_manager: state_manager,
        router: router,
        createHistory: createHistory,
        i18n: i18n
      };
      ReactDOM.render(
        React.createElement(ApplicationComponent, initial_props),
        document.getElementById('root'));
    })
    .catch((err)=>{
      console.error(err.stack);
    });

  // setTranslations(router)
  //   .then((_i18n)=>{
  //     i18n = _i18n;
  //     router = new Router(state_manager, i18n);
  //     return state_manager.getInitialData();
  //   })
  //   .then(()=>{
  //     return router.setLocationToCurrentUrl();
  //   })
  //   .then(() => {
  //     var initial_props = Object.assign({
  //       state_manager: state_manager,
  //       router: router,
  //       createHistory: createHistory,
  //       i18n: i18n
  //     }, state_manager.state);
  //     ReactDOM.render(
  //       React.createElement(ApplicationComponent, initial_props),
  //       document.getElementById('root'));
  //   })
  //   .catch((err)=>{
  //     console.error(err);
  //   });
}
