/*global module*/

import React from 'react';
import mixin from './../../lib/mixin';

import TranslatableComponent from '../translatable/translatable.component';
import {footprint} from './../../lib/mixins/components/footprint';
import template from './shopping.rt.html'

class ShoppingComponent extends mixin(TranslatableComponent, footprint) {

  constructor(props, context){
    super(props, context);
    let shopping = this;
    shopping.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('shopping.title');
  }

  get router(){
    return this.props.router
  }

  componentDidMount() {
    let shopping = this;
  }

  updateResults(){
    let shopping = this;
  }

  render(){
    return template.call(this);
  }

}

ShoppingComponent.propTypes = {

};
ShoppingComponent.contextTypes = {
  i18n: React.PropTypes.any
}

ShoppingComponent.NAME = 'Shopping';

module.exports = ShoppingComponent;
