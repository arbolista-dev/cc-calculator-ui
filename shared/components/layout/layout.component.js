/*global module document window */

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './layout.rt.html';
import footprintContainer from 'shared/containers/footprint.container';
import { footprintPropTypes } from 'shared/containers/footprint.container';

const NON_GRAPH_PANELS = ['Leaders', 'Settings', 'Profile', 'ForgotPassword', 'Footprint', 'MissingRoute'];

class LayoutComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let layout = this;
    layout.state = {};
  }

  componentWillReceiveProps(nextProps){
    // passing false to setUserAnswersToDefault means no alerts will be triggered!
    if (nextProps.average_footprint.get('reset')) this.setUserAnswersToDefault(false);
    if (this.props.location.get('route_name') !== nextProps.location.get('route_name') && nextProps.ui.get('alert_exists')) this.props.resetAlerts();
  }

  componentWillMount(){
    this.receiveExternalOffset()

    if (!this.state_manager.average_footprint_storage || !this.state_manager.user_footprint_storage) this.props.ensureDefaults(this.getDefaultInputs());
  }

  render() {
    return template.call(this);
  }

  get initial_load_done(){
    if (!this.state_manager.average_footprint_storage || !this.state_manager.user_footprint_storage || !this.state_manager.take_action_storage) {
      return this.isUserFootprintSet() && this.props.user_footprint.get('loading') === false;
    } else {
      return this.isUserFootprintSet();
    }
  }

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'shared']).toJS();
  }

  get current_route(){
    return this.router.routes.getRoute(this.current_route_name);
  }

  get graphing_route(){
    return NON_GRAPH_PANELS.indexOf(this.current_route_name) < 0;
  }

  get is_no_app_route(){
    let result = this.router.routes.getRoute(this.current_route_name);
    return result !== undefined && result.route_name === 'MissingRoute';
  }

  get external_offset(){
    return this.props.ui.get('external_offset').toJS();
  }

  get show_take_action_now(){
    return ['TakeAction', 'Settings'].indexOf(this.current_route_name) < 0;
  }

  get show_user_answers_reset(){
    if (this.current_route_name === 'GetStarted') {
      return this.state_manager.user_footprint_storage.hasOwnProperty('input_size');
    } else {
      return false;
    }
  }

  getRouteTitle(route) {
    return this.t(`${route.key}.title`);
  }

  receiveExternalOffset(){
    let layout = this;
    window.addEventListener('message', ((event) => {
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

  destroyPrerenderData() {
    let prerender_data = document.getElementById('prerender_data');
    window.PrerenderData = undefined;
    if (prerender_data) prerender_data.parentNode.removeChild(prerender_data);
  }

}
LayoutComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(LayoutComponent);
