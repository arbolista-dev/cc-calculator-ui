/*global module Promise document window DESIGN*/

import React from 'react';

import StateManager from './../../lib/state_manager/state_manager';
import mixin from './../../lib/mixin';
import Translatable from './../../lib/base_classes/translatable';
import {routable} from './../../lib/mixins/routable';
import template from './layout.rt.html';

const NON_GRAPH_PANELS = ['Settings', 'ForgotPassword']

class LayoutComponent extends mixin(Translatable, routable) {

  constructor(props, context) {
    super(props, context);
    var layout = this;
    layout.state = {};
    context.state_manager.layout = layout;
  }

  render() {
    return template.call(this);
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get current_route_name() {
    return this.state_manager.state.route.route_name;
  }

  get alert_list() {
    return this.state_manager.state.alerts;
  }

  get graphing_route(){
    return NON_GRAPH_PANELS.indexOf(this.current_route_name) < 0;
  }

  goToSettings(){
    this.router.goToRouteByName('Settings');
  }

  componentDidMount() {
    var layout = this;
    layout.router.initializeHistory(layout);
  }

  syncFromStateManager() {
    var layout = this;
    return new Promise((fnResolve, _fnReject) => {
      layout.forceUpdate(() => {
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

}
LayoutComponent.NAME = 'Layout';
LayoutComponent.propTypes = {};

module.exports = LayoutComponent;
