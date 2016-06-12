import mixin from '../mixin';
import Translatable from './translatable';
import {routable} from '../mixins/routable';
import {footprintable} from '../mixins/footprintable';
import {resizable} from '../mixins/resizable';

export default class Panel extends mixin(Translatable, routable, footprintable, resizable) {

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get current_route_name() {
    return this.state_manager.state.route.route_name;
  }

  routeComponent(route_name){
    return route_name === this.constructor.NAME;
  }

}
