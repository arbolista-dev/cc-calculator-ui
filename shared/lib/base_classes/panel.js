import mixin from '../mixin';
import Translatable from './translatable';
import {routable} from '../mixins/routable';
import {footprintable} from '../mixins/footprintable';

export default class Panel extends mixin(Translatable, routable, footprintable) {

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get current_route_name() {
    return this.state_manager.state.route.route_name;
  }

}
