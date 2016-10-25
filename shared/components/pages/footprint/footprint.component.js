/*global module window $*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './footprint.rt.html';
import footprintContainer from 'shared/containers/footprint.container';
import { footprintPropTypes } from 'shared/containers/footprint.container';

class FootprintComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let footprint = this;
    footprint.state = {}
  }

  get show_leaders_comparison(){
    return this.connect_to_api && this.props.ui.getIn(['leaders_chart', 'show']);
  }

  render(){
    return template.call(this);
  }
}

FootprintComponent.propTypes = footprintPropTypes;
FootprintComponent.NAME = 'Footprint';

module.exports = footprintContainer(FootprintComponent);
