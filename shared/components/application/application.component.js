/*global module */
import React from 'react';

import LayoutComponent from '../layout/layout.component';
import { Provider } from 'react-redux';
import StateManager from 'shared/lib/state_manager/state_manager';
import Router from 'shared/lib/router/router';

class ApplicationComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  get router(){
    return this.props.router;
  }

  get state_manager(){
    return this.props.state_manager;
  }

  getChildContext() {
    return {
      state_manager: this.state_manager,
      router: this.router,
      i18n: this.props.i18n
    };
  }

  componentDidMount() {
    let component = this;
    component.initializeHistory();
  }

  initializeHistory() {
    let component = this,
        createHistory = component.props.createHistory;

    component.router.initializeHistory(createHistory, component.state_manager.store);
  }

  render() {
    return React.createElement(Provider,
      {
        store: this.state_manager.store
      },
      React.createElement(LayoutComponent)
    );
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
