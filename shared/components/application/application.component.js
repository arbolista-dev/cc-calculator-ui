/* global module */
/* eslint react/no-unused-prop-types: 1 */

import React from 'react';
import { Provider } from 'react-redux';
import StateManager from 'shared/lib/state_manager/state_manager';
import Router from 'shared/lib/router/router';
import LayoutComponent from '../layout/layout.component';

class ApplicationComponent extends React.Component {

  getChildContext() {
    return {
      state_manager: this.state_manager,
      router: this.router,
      i18n: this.props.i18n,
    };
  }


  componentDidMount() {
    const component = this;
    component.initializeHistory();
  }

  get router() {
    return this.props.router;
  }

  get state_manager() {
    return this.props.state_manager;
  }

  initializeHistory() {
    const component = this;
    const createHistory = component.props.createHistory;

    component.router.initializeHistory(createHistory, component.state_manager.store);
  }

  render() {
    return React.createElement(Provider,
      {
        store: this.state_manager.store,
      },
      React.createElement(LayoutComponent),
    );
  }

}

ApplicationComponent.propTypes = {
  state_manager: React.PropTypes.instanceOf(StateManager).isRequired,
  router: React.PropTypes.instanceOf(Router).isRequired,
  i18n: React.PropTypes.object.isRequired,
  // only required in browser
  createHistory: React.PropTypes.func,
};

ApplicationComponent.childContextTypes = {
  state_manager: React.PropTypes.instanceOf(StateManager).isRequired,
  router: React.PropTypes.instanceOf(Router).isRequired,
  i18n: React.PropTypes.object.isRequired,
};


ApplicationComponent.NAME = 'Application';

module.exports = ApplicationComponent;
