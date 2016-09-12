import mixin from '../mixin';
import Translatable from './translatable';
import {footprintable} from '../mixins/footprintable';
import {resizable} from '../mixins/resizable';

const MAX_SLIDER_WIDTH = 600,
    MIN_SLIDER_WIDTH = 250;

export default class Panel extends mixin(Translatable, footprintable, resizable) {

  get route_key() {
    return this.router.current_route.key
  }

  get current_route_name(){
    return this.props.location.get('route_name');
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
    // return this.props.getState.get('connect_to_api').toJS()
    return true;
  }

  routeComponent(route_name){
    return route_name === this.constructor.NAME;
  }

}
