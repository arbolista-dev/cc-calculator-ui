/*global module Promise document window DESIGN*/

import React from 'react';

import StateManager from './../../lib/state_manager/state_manager';
// import mixin from './../../lib/mixin';
// import Translatable from './../../lib/base_classes/translatable';
// import {routable} from './../../lib/mixins/routable';
import Panel from './../../lib/base_classes/panel';
import layoutContainer from './layout.container';
import template from './layout.rt.html';

const NON_GRAPH_PANELS = ['Settings', 'ForgotPassword', 'Footprint']

class LayoutComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    var layout = this;
    layout.state = {};
    // context.state_manager.layout = layout;
  }

  render() {
    return template.call(this);
  }

  // get route_key() {
  //   return this.state_manager.state.route.key;
  // }
  //
  // get current_route_name() {
  //   return this.state_manager.state.route.route_name;
  // }

  get route_name(){
    return this.props.location.get('route_name');
  }

  get current_route_name() {
    return this.route_name;
  }

  get current_route(){
    console.log('layout component, route_name: ', this.route_name)
    console.log('get route: ', this.router.routes.getRoute(this.route_name));
    return this.router.routes.getRoute(this.route_name);
  }

  goToRoute(route_name){
    let router = this;

    window.jQuery("[data-toggle='popover']").popover('hide');
    window.jQuery("html, body").animate({ scrollTop: 0 }, 500, ()=>{
      return router.pushRoute(route_name);
    });
  }

  // get alert_list() {
  //   return this.state_manager.state.alerts;
  // }

  // get graphing_route(){
  //   return NON_GRAPH_PANELS.indexOf(this.current_route_name) < 0;
  // }

  // get external_offset(){
  //   return this.state_manager.state.external_offset;
  // }

  // get show_take_action_now(){
  //   return ['TakeAction', 'Settings'].indexOf(this.current_route_name) < 0;
  // }

  // goToSettings(){
  //   this.router.goToRouteByName('Settings');
  // }

  // componentDidMount() {
  //   var layout = this;
  //   layout.router.initializeHistory(layout);
  // }

  // syncFromStateManager() {
  //   var layout = this;
  //   return new Promise((fnResolve, _fnReject) => {
  //     layout.forceUpdate(() => {
  //       // Prerendered data should be consumed after the first time the
  //       // state is set from the URL.
  //       layout.destroyPrerenderData();
  //       fnResolve();
  //     });
  //   });
  // }

  destroyPrerenderData() {
    var prerender_data = document.getElementById('prerender_data');
    window.PrerenderData = undefined;
    if (prerender_data) prerender_data.parentNode.removeChild(prerender_data);
  }

  // goToTakeAction(){
  //   this.router.goToRouteByName('TakeAction');
  // }

}
LayoutComponent.propTypes = {
  location: React.PropTypes.object.isRequired
};

module.exports = layoutContainer(LayoutComponent);
