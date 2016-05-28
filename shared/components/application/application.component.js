/*global module */
import React from 'react';

import LayoutComponent from '../layout/layout.component';
import StateManager from './../../lib/state_manager/state_manager';
import Router from './../../lib/router/router';

class ApplicationComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return {
      state_manager: this.props.state_manager,
      router: this.props.router,
      i18n: this.props.i18n
    };
  }

  render() {
    return React.createElement(LayoutComponent, this.props);
  }

}

ApplicationComponent.propTypes = {
  state_manager: React.PropTypes.instanceOf(StateManager).isRequired,
  router: React.PropTypes.instanceOf(Router).isRequired,
  i18n: React.PropTypes.object.isRequired,
  // only required in browser
  createHistory: React.PropTypes.func
};

ApplicationComponent.childContextTypes = {
  state_manager: React.PropTypes.instanceOf(StateManager).isRequired,
  router: React.PropTypes.instanceOf(Router).isRequired,
  i18n: React.PropTypes.object.isRequired
}


ApplicationComponent.NAME = 'Application';

module.exports = ApplicationComponent;
