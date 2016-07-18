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

  render(){
    return template.call(this);
  }
}

FootprintComponent.propTypes = {

};

FootprintComponent.NAME = 'Footprint';

module.exports = FootprintComponent;
