import mixin from '../mixin';
import Translatable from './translatable';
import {takeactionable} from '../mixins/takeactionable';

export default class Unit extends mixin(Translatable, takeactionable) {

}
