import React from 'react';

import StateManager from '../state_manager/state_manager';
import Router from '../router/router';

export default class ContextableComponent extends React.Component {

  get state_manager(){
    return this.context.state_manager;
  }
  get router(){
    return this.context.router;
  }
  get i18n(){
    return this.context.i18n;
  }

  getChildContext(){
    return {
      state_manager: this.state_manager,
      router: this.router,
      i18n: this.i18n
    }
  }

};

ContextableComponent.childContextTypes = {
  state_manager: React.PropTypes.instanceOf(StateManager).isRequired,
  router: React.PropTypes.instanceOf(Router).isRequired,
  i18n: React.PropTypes.object.isRequired
}

ContextableComponent.contextTypes = {
  state_manager: React.PropTypes.instanceOf(StateManager).isRequired,
  router: React.PropTypes.instanceOf(Router).isRequired,
  i18n: React.PropTypes.object.isRequired
}


