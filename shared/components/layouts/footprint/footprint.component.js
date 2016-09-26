/*global module*/

import React from 'react';

import Panel from 'shared/lib/base_classes/panel';
import template from './footprint.rt.html';
import footprintContainer from '../../../containers/footprint.container';
import { footprintPropTypes } from '../../../containers/footprint.container';

class FootprintComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let footprint = this;
    footprint.state = {}
  }

  toggleLeadersChart() {
    let footprint = this,
        ui = {};
    
    ui.id = 'leaders_chart';
    ui.data = {
      show: true,
      category: ''
    };
    footprint.props.updateUI(ui);
    window.jQuery('html, body').animate({ scrollTop: $('.cc_leaders').offset().top }, 1000);
  }

  render(){
    return template.call(this);
  }
}

FootprintComponent.propTypes = footprintPropTypes;
FootprintComponent.NAME = 'Footprint';

module.exports = footprintContainer(FootprintComponent);
