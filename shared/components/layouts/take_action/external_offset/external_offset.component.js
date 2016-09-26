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

  get total_footprint() {
    let external_offset = this;
    return external_offset.state_manager.state.user_footprint['result_grand_total']
  }

  get display_total_footprint() {
    let external_offset = this;
    return Math.round(external_offset.total_footprint)
  }

  get display_monthly_offset() {
    let external_offset = this,
        price_per_ton = external_offset.state_manager.state.external_offset.carbon_price_per_ton;
    return Math.round((external_offset.total_footprint * price_per_ton) / 12)
  }

  get display_offset_description() {
    let external_offset = this;
    return external_offset.state_manager.state.external_offset.description
  }

  get offset_url() {
    let external_offset = this;
    return external_offset.state_manager.state.external_offset.offset_url
  }

  render(){
    return template.call(this);
  }

}

ExternalOffsetComponent.NAME = 'ExternalOffset';

module.exports = ExternalOffsetComponent;
