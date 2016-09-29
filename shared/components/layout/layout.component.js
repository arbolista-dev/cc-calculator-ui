/*global module Promise document window DESIGN*/

import React from 'react';

import { fromJS } from 'immutable';
import StateManager from 'shared/lib/state_manager/state_manager';
import Panel from 'shared/lib/base_classes/panel';
import footprintContainer from '../../containers/footprint.container';
import { footprintPropTypes } from '../../containers/footprint.container';
import template from './layout.rt.html';

const NON_GRAPH_PANELS = ['Leaders', 'Settings', 'ForgotPassword', 'Footprint', 'MissingRoute'];
const NON_LEADERS_PANELS = ['GetStarted', 'Settings', 'ForgotPassword'];

class LayoutComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let layout = this;
    layout.state = {};
  }

  componentWillMount(){
    let default_inputs = this.getDefaultInputs();
    this.receiveExternalOffset()
    this.props.ensureDefaults(default_inputs)
  }

  render() {
    return template.call(this);
  }

  get initial_load_done(){
    return this.isUserFootprintSet() && this.props.user_footprint.get('loading') === false
  }

  get alert_list(){
    return this.props.ui.getIn(['alerts', 'shared']).toJS()
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

  get graphing_route(){
    return NON_GRAPH_PANELS.indexOf(this.current_route_name) < 0;
  }

  get is_no_app_route(){
    let result;
    this.router.app_routes.forEach((route) => {
      if (route.route_name === this.current_route_name) {
        result = true;
      }
    })
    if (result === undefined){
      return true;
    } else {
      return false;
    }
  }

  get show_leaders_comparison(){
    let leaders_route = NON_LEADERS_PANELS.indexOf(this.current_route_name) < 0;

    return this.connect_to_api && leaders_route && this.props.ui.getIn(['leaders_chart', 'show'])
  }

  get show_take_action_now(){
    return ['TakeAction', 'Settings'].indexOf(this.current_route_name) < 0;
  }

  get show_take_action_now(){
    return ['TakeAction', 'Settings'].indexOf(this.current_route_name) < 0;
  }

  get external_offset(){
    return this.props.ui.get('external_offset').toJS();
  }

  get show_user_answers_reset(){
    if (this.current_route_name === 'GetStarted') {
      return this.state_manager.user_footprint_storage.hasOwnProperty('input_size');
    } else {
      return false;
    }
  }

  goToRoute(route_name){
    let router = this;
    window.jQuery("[data-toggle='popover']").popover('hide');
    window.jQuery('html, body').animate({ scrollTop: 0 }, 500, ()=>{
      return router.pushRoute(route_name);
    });
  }

  goToSettings(){
    this.router.goToRouteByName('Settings');
  }

  goToTakeAction(){
    this.router.goToRouteByName('TakeAction');
  }

  receiveExternalOffset(){
    let layout = this;
    window.addEventListener('message', ((event) => {
      // optional origin check:
      // if(event.origin !== 'http://localhost:8080') return;
      try {
        let data = JSON.parse(event.data);
        if (data.hasOwnProperty('cta')) {
          layout.props.updateUI({id: 'external_offset', data: data});
          if (data.hasOwnProperty('connect_to_api')) {
              if (!layout.props.ui.getIn(['external_offset', 'connect_to_api'])) {
                layout.props.updateUI({id: 'connect_to_api', data: false});
              }
          }
        }
      } catch (e) {
        return null;
      }
    }),false);
  }

  setUserAnswersToDefault(){
    let layout = this,
    default_inputs = layout.getDefaultInputs();
    layout.resetUserFootprint();
    layout.props.ensureDefaults(default_inputs);

    let alert = {};
    alert.id = 'shared';
    alert.data = {
      route: layout.current_route_name,
      type: 'success',
      message: layout.t('success.answers_reset')
    };
    layout.props.pushAlert(alert);
  }

  destroyPrerenderData() {
    let prerender_data = document.getElementById('prerender_data');
    window.PrerenderData = undefined;
    if (prerender_data) prerender_data.parentNode.removeChild(prerender_data);
  }

}
LayoutComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(LayoutComponent);
