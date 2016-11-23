import React from 'react';
import { Provider } from 'react-redux';
import StateManager from 'shared/lib/state_manager/state_manager';
import Router from 'shared/lib/router/router';
import { fromJS } from 'immutable';


export default function wrapWithContext(children, ui = {}, props = {}) {
  const state_manager = new StateManager();
  const initial_state = state_manager.initialState({
    location: fromJS({
      pathname: '/',
      query: {},
      route_name: 'GetStarted',
      params: {},
      ui,
    }),
  });
  state_manager.initializeStore(initial_state);
  const store = state_manager.store;
  const i18n = {
    t(key, opts) {
      if (!opts) return key;
      return key.replace(/{{([^{}]*)}}/g,
          (a, b) => {
            const r = opts[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
          },
      );
    },
    language: 'en',
  };
  i18n.getFixedT = () => i18n.t;

  const router = new Router(i18n);

  class wrapperWithContext extends React.Component {

    getChildContext() {
      return {
        state_manager,
        router,
        i18n,
      };
    }
    render() {
      return React.createElement(Provider,
        {
          store,
        },
      React.createElement(children, props));
    }
  }
  wrapperWithContext.childContextTypes = {
    state_manager: React.PropTypes.instanceOf(StateManager).isRequired,
    router: React.PropTypes.instanceOf(Router).isRequired,
    i18n: React.PropTypes.object.isRequired,
  };

  return React.createElement(wrapperWithContext);
}
