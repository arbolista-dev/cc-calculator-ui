import mixin from '../mixin';
import Translatable from './translatable';
import {routable} from '../mixins/routable';
import {footprintable} from '../mixins/footprintable';
import {resizable} from '../mixins/resizable';

const MAX_SLIDER_WIDTH = 600,
    MIN_SLIDER_WIDTH = 250;

export default class Panel extends mixin(Translatable, routable, footprintable, resizable) {

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get current_route_name() {
    return this.state_manager.state.route.route_name;
  }

  get slider_width(){
    let width = window.outerWidth * 0.8;
    width = Math.min(MAX_SLIDER_WIDTH, width);
    width = Math.max(MIN_SLIDER_WIDTH, width);
    return width
  }

  routeComponent(route_name){
    return route_name === this.constructor.NAME;
  }

}
