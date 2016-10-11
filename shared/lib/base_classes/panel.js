/*global window*/

import mixin from '../mixin';
import Translatable from './translatable';
import {footprintable} from '../mixins/footprintable';
import {resizable} from '../mixins/resizable';
import { tokenIsValid } from '../utils/utils'

const MAX_SLIDER_WIDTH = 600,
    MIN_SLIDER_WIDTH = 250;

export default class Panel extends mixin(Translatable, footprintable, resizable) {

  get route_key() {
    return this.router.current_route.key
  }

  get current_route_name(){
    return this.props.location.get('route_name');
  }

  get user_authenticated(){
    if (this.props.auth.hasIn(['data', 'token'])) {
      return tokenIsValid(this.props.auth.getIn(['data', 'token']))
    } else {
      return false;
    }
  }

  get slider_width(){
    let width = window.innerWidth * 0.8;
    width = Math.min(MAX_SLIDER_WIDTH, width);
    width = Math.max(MIN_SLIDER_WIDTH, width);
    return width
  }

  get connect_to_api(){
    return this.props.ui.get('connect_to_api')
  }

  pushRoute(route_name, action, payload){
    this.router.pushRoute(route_name, action, payload);
  }

  toggleLeadersChart() {
    let component = this,
        ui = {
          id: 'leaders_chart',
          data: {
            show: true
          }
        };

    this.props.updateUI(ui);
    window.jQuery('html, body').animate({ scrollTop: $('.cc_leaders').offset().top }, 1000);
  }

  setUserAnswersToDefault(show_alert){
    // show_alert needed here since loggedIn/loggedOut actions otherwise fail (as they also trigger alerts)

    let component = this,
        init = true;

    component.resetUserFootprint();

    let default_inputs = component.getDefaultInputs(init);
    component.props.ensureDefaults(default_inputs);

    if (show_alert) {
      let alert = {
        id: 'shared',
        data: [{
          type: 'success',
          message: component.t('success.answers_reset')
        }]
      };
      component.props.pushAlert(alert);
    }
  }

  routeComponent(route_name){
    return route_name === this.constructor.NAME;
  }
}
