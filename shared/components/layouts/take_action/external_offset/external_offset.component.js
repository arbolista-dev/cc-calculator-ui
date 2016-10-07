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

  render(){
    return template.call(this);
  }

  get offset_title() {
    return this.props.ui.getIn(['external_offset', 'cta', 'title'])
  }

  get show_equation() {
    return this.props.ui.getIn(['external_offset', 'cta', 'show_equation'])
  }

  get display_total_footprint() {
    return Math.round(this.props.totalUserFootprint)
  }

  get display_monthly_offset() {
    let external_offset = this,
        price_per_ton = external_offset.props.ui.getIn(['external_offset', 'cta', 'carbon_price_per_ton']);
    return Math.round((external_offset.props.totalUserFootprint * price_per_ton) / 12);
  }

  get display_offset_description() {
    return this.props.ui.getIn(['external_offset', 'cta', 'description']);
  }

  get offset_button_title() {
    return this.props.ui.getIn(['external_offset', 'cta', 'button_title']);
  }

  get offset_url() {
    return this.props.ui.getIn(['external_offset', 'cta', 'offset_url']);
  }
}

ExternalOffsetComponent.NAME = 'ExternalOffset';
ExternalOffsetComponent.propTypes = {
  ui: React.PropTypes.object.isRequired,
  totalUserFootprint: React.PropTypes.string.isRequired
}

module.exports = ExternalOffsetComponent;
