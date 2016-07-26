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

  toggleLeadersChart() {
    let travel = this;
    travel.state_manager.state.leaders_chart.show = true;
    travel.state_manager.syncLayout();
    window.jQuery("html, body").animate({ scrollTop: $(".cc_leaders").offset().top }, 1000);
  }

  render(){
    return template.call(this);
  }
}

FootprintComponent.propTypes = {

};

FootprintComponent.NAME = 'Footprint';

module.exports = FootprintComponent;
