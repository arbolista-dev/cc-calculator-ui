/*global module*/

import React from 'react';
import mixin from './../../lib/mixin';

import TranslatableComponent from '../translatable/translatable.component';
import {footprint} from './../../lib/mixins/components/footprint';
import template from './home.rt.html'

class HomeComponent extends mixin(TranslatableComponent, footprint) {

  constructor(props, context){
    super(props, context);
    let home = this;
    home.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('home.title');
  }

  get router(){
    return this.props.router
  }

  componentDidMount() {
    let home = this;
  }

  updateResults(){
    let home = this;
  }

  render(){
    return template.call(this);
  }

}

HomeComponent.propTypes = {

};
HomeComponent.contextTypes = {
  i18n: React.PropTypes.any
}

HomeComponent.NAME = 'Home';

module.exports = HomeComponent;
