/*global module*/

import React from 'react';

import Translatable from './../../../lib/base_classes/translatable';
import template from './external_offset.rt.html'

class ExternalOffsetComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let external_offset = this;
    external_offset.state = {}
  }

  get offset_title() {
    let external_offset = this;
    return external_offset.state_manager.state.external_offset.cta.title;
  }

  get show_equation() {
    let external_offset = this;
    return external_offset.state_manager.state.external_offset.cta.show_equation;
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
    price_per_ton = external_offset.state_manager.state.external_offset.cta.carbon_price_per_ton;
    return Math.round((external_offset.total_footprint * price_per_ton) / 12)
  }

  get display_offset_description() {
    let external_offset = this;
    return external_offset.state_manager.state.external_offset.cta.description
  }

  get offset_button_title() {
    let external_offset = this;
    return external_offset.state_manager.state.external_offset.cta.button_title;
  }

  get offset_url() {
    let external_offset = this;
    return external_offset.state_manager.state.external_offset.cta.offset_url;
  }

  render(){
    return template.call(this);
  }

}

ExternalOffsetComponent.NAME = 'ExternalOffset';

module.exports = ExternalOffsetComponent;
