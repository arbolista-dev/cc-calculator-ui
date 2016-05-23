/*global module*/

import React from 'react';

import Panel from './../../lib/base_classes/panel';
import template from './footprint.rt.html'

class FootprintComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let footprint = this;
    footprint.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('footprint.title');
  }

  get router(){
    return this.props.router
  }

  componentDidMount() {
    let footprint = this;
  }

  updateResults(){
    let footprint = this;
  }

  render(){
    return template.call(this);
  }

}

FootprintComponent.propTypes = {

};

FootprintComponent.NAME = 'Footprint';

module.exports = FootprintComponent;
