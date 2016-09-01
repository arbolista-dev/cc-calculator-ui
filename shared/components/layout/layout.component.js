/*global module Promise document window DESIGN*/

import React from 'react';

import { fromJS } from 'immutable';
import StateManager from 'shared/lib/state_manager/state_manager';
import Panel from 'shared/lib/base_classes/panel';
// import layoutContainer from './layout.container';
import footprintContainer from '../../containers/footprint.container';
import { footprintPropTypes } from '../../containers/footprint.container';
import template from './layout.rt.html';

const NON_GRAPH_PANELS = ['Settings', 'ForgotPassword', 'Footprint']

class LayoutComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    var layout = this;
    layout.state = {};
    // context.state_manager.layout = layout;
  }

  get user_footprint_set(){
    return Object.keys(this.props.user_footprint.get('data').toJS()).length !== 0
  }

  componentWillMount(){
    let location;

    if (!this.user_footprint_set) {
      location = this.state_manager.default_inputs;
    } else {
      location = {
        input_location_mode: this.userApiValue('input_location_mode'),
        input_location: this.userApiValue('input_location'),
        input_income: this.userApiValue('input_income'),
        input_size: this.userApiValue('input_size')
      }
    }
    this.props.ensureDefaults(location)
  }

  render() {
    return template.call(this);
  }

  get route_name(){
    return this.props.location.get('route_name');
  }

  get current_route_name() {
    return this.route_name;
  }

  get current_route(){
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

  destroyPrerenderData() {
    var prerender_data = document.getElementById('prerender_data');
    window.PrerenderData = undefined;
    if (prerender_data) prerender_data.parentNode.removeChild(prerender_data);
  }

  // goToTakeAction(){
  //   this.router.goToRouteByName('TakeAction');
  // }

}
LayoutComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(LayoutComponent);
