/*global module Promise document window DESIGN*/

import React from 'react';

import { fromJS } from 'immutable';
import StateManager from 'shared/lib/state_manager/state_manager';
import Panel from 'shared/lib/base_classes/panel';
// import layoutContainer from './layout.container';
import footprintContainer from '../../containers/footprint.container';
import { footprintPropTypes } from '../../containers/footprint.container';
import template from './layout.rt.html';

const NON_GRAPH_PANELS = ['Leaders', 'Settings', 'ForgotPassword', 'Footprint'];
const NON_LEADERS_PANELS = ['GetStarted', 'Settings', 'ForgotPassword'];

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
    let default_inputs = this.getDefaultInputs();

    console.log('ensureDefaults from layout component! params: ', default_inputs);
    this.props.ensureDefaults(default_inputs)
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
  //
  // get alert_list() {
  //   return this.state_manager.state.alerts.shared;
  // }
  //
  // get graphing_route(){
  //   return NON_GRAPH_PANELS.indexOf(this.current_route_name) < 0;
  // }
  //
  // get show_leaders_comparison(){
  //   let leaders_route = NON_LEADERS_PANELS.indexOf(this.current_route_name) < 0;
  //
  //   return this.connect_to_api && leaders_route && this.state_manager.state.leaders_chart.show;
  // }
  //
  // get external_offset(){
  //   return this.state_manager.state.external_offset;
  // }
  //
  // get connect_to_api(){
  //   return this.state_manager.state.connect_to_api;
  // }
  //
  // get show_user_answers_reset(){
  //   if (this.current_route_name === 'GetStarted') {
  //     return this.state_manager.user_footprint_storage.hasOwnProperty('input_size');
  //   } else {
  //     return false;
  //   }
  // }

  get show_take_action_now(){
    return ['TakeAction', 'Settings'].indexOf(this.current_route_name) < 0;
  }

  // get external_offset(){
  //   return this.state_manager.state.external_offset;
  // }

  get show_take_action_now(){
    return ['TakeAction', 'Settings'].indexOf(this.current_route_name) < 0;
  }

  // setUserAnswersToDefault(){
  //   let layout = this;
  //   layout.state_manager.setUserFootprintStorageToDefault();
  //   layout.state_manager.state.alerts.shared.push({type: 'success', message: layout.t('success.answers_reset')});
  // }
  //

  goToSettings(){
    this.router.goToRouteByName('Settings');
  }

  goToTakeAction(){
    this.router.goToRouteByName('TakeAction');
  }

  destroyPrerenderData() {
    var prerender_data = document.getElementById('prerender_data');
    window.PrerenderData = undefined;
    if (prerender_data) prerender_data.parentNode.removeChild(prerender_data);
  }

}
LayoutComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(LayoutComponent);
