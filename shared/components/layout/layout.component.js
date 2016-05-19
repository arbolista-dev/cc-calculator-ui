/*global module Promise document window DESIGN*/

import React from 'react';

import StateManager from './../../lib/state_manager/state_manager';
import TranslatableComponent from '../translatable/translatable.component';
import template from './layout.rt.html';

class LayoutComponent extends TranslatableComponent {

  constructor(props, context) {
    super(props, context);
    var layout = this;
    layout.state = {};
    props.state_manager.layout = layout;
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get current_route_name() {
    return this.state_manager.state.route.route_name;
  }

  get router(){
    return this.props.router;
  }

  goToRoute(route, _event){
    let layout = this;
    return layout.router.goToRoute(route);
  }

  getChildContext() {
    return {
      i18n: this.context.i18n
    };
  }

  componentDidMount() {
    var layout = this;
    layout.router.initializeHistory(layout);
  }


  syncFromStateManager() {
    var layout = this;
    return new Promise((fnResolve, _fnReject) => {
      layout.setState(layout.state_manager.state, () => {
        // Prerendered data should be consumed after the first time the
        // state is set from the URL.
        layout.destroyPrerenderData();
        fnResolve();
      });
    });
  }

  destroyPrerenderData() {
    var prerender_data = document.getElementById('prerender_data');
    window.PrerenderData = undefined;
    if (prerender_data) prerender_data.parentNode.removeChild(prerender_data);
  }

  render() {
    return template.call(this);
  }

}
LayoutComponent.NAME = 'Layout';
LayoutComponent.propTypes = {
  environment: React.PropTypes.any,
  state_manager: React.PropTypes.instanceOf(StateManager).isRequired
}
LayoutComponent.childContextTypes = {
  i18n: React.PropTypes.any
}
LayoutComponent.contextTypes = {
  i18n: React.PropTypes.any
}

module.exports = LayoutComponent;
