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

  pushRoute(route_name, action, payload){
    this.router.pushRoute(route_name, action, payload);
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

  setUserAnswersToDefault(){
    let component = this,
    default_inputs = component.getDefaultInputs();
    component.resetUserFootprint();
    component.props.ensureDefaults(default_inputs);

    let alert = {};
    alert.id = 'shared';
    alert.data = [{
      route: component.current_route_name,
      type: 'success',
      message: component.t('success.answers_reset')
    }];
    component.props.pushAlert(alert);
  }

  routeComponent(route_name){
    return route_name === this.constructor.NAME;
  }

}
