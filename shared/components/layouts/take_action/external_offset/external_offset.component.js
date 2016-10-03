/*global module*/

import React from 'react';

import Translatable from 'shared/lib/base_classes/translatable';
import template from './external_offset.rt.html'

class ExternalOffsetComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let external_offset = this;
    external_offset.state = {}
  }

  get display_total_footprint() {
    console.log('totalUserFootprint', this.props.totalUserFootprint);
    return Math.round(this.props.totalUserFootprint)
  }

  get display_monthly_offset() {
    let external_offset = this,
        price_per_ton = external_offset.props.ui.getIn(['external_offset', 'carbon_price_per_ton']);
    return Math.round((external_offset.props.totalUserFootprint * price_per_ton) / 12);
  }

  get display_offset_description() {
    return external_offset.props.ui.getIn(['external_offset', 'description']);
  }

  get offset_url() {
    return external_offset.props.ui.getIn(['external_offset', 'offset_url']);
  }

  render(){
    return template.call(this);
  }

}

ExternalOffsetComponent.NAME = 'ExternalOffset';
ExternalOffsetComponent.propTypes = {
  ui: React.PropTypes.object.isRequired,
  totalUserFootprint: React.PropTypes.string.isRequired
}

module.exports = ExternalOffsetComponent;
