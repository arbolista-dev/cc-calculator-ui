/*global module*/

import React from 'react';
import mixin from './../../lib/mixin';
import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';

import TranslatableComponent from '../translatable/translatable.component';
import {footprint} from './../../lib/mixins/components/footprint';
import template from './shopping.rt.html'

// We are ignoring goods_other_total - if advanced selected,
// user must answer advanced other good questions.
const GOODS_QUESTIONS = [
      'furnitureappliances', 'clothing',
      'other_entertainment', 'other_office', 'other_personalcare',
      'other_autoparts', 'other_medical'
    ],
    SERVICES_QUESTIONS = [
      'healthcare', 'education', 'communications',
      'vehicleservices', 'finance', 'household', 'charity', 'miscservices'
    ];


class ShoppingComponent extends mixin(TranslatableComponent, footprint) {

  constructor(props, context){
    super(props, context);
    let shopping = this;
    shopping.state = Object.assign({
      simple: true
    }, shopping.initial_shopping_state);
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('shopping.title');
  }

  get router(){
    return this.props.router
  }

  get goods_questions(){
    return GOODS_QUESTIONS
  }

  get average_goods_expend(){
    return this.state_manager.average_footprint['input_footprint_shopping_goods_total'];
  }

  get services_questions(){
    return SERVICES_QUESTIONS;
  }

  get average_services_expend(){
    return this.state_manager.average_footprint['input_footprint_shopping_services_total'];
  }

  get initial_shopping_state(){
    let initial_state = {},
        shopping = this;
    GOODS_QUESTIONS.forEach((goods_type)=>{
      let api_key = shopping.apiKey(goods_type);
      initial_state[goods_type] = shopping.state_manager.user_footprint[api_key];
    });
    SERVICES_QUESTIONS.forEach((services_type)=>{
      let api_key = shopping.apiKey(services_type);
      initial_state[services_type] = shopping.state_manager.user_footprint[api_key];
    });
    return initial_state;
  }

  apiKey(type){
    let shopping = this;
    if (GOODS_QUESTIONS.indexOf(type) >= 0){
      return `input_footprint_shopping_goods_${type}`;
    } else {
      return `input_footprint_shopping_services_${type}`;
    }
  }

  displayMonthlyExpenditure(type){
    return Math.round(this.state[type]);
  }

  /*
   * Callbacks
   */

  componentDidMount() {
    let shopping = this;
    shopping.initializeGoodsSlider();
    shopping.initializeServicesSlider();
  }

  updateMonthlyExpenditure(event){
    let shopping = this,
        api_key = event.target.dataset.api_key,
        type = event.target.dataset.type;
    shopping.setState({[type]: event.target.value});
    shopping.updateFootprint({[api_key]: event.target.value});
  }

  /*
   * Simple/Advanced
   */

  get simple(){
    return this.state.simple;
  }

  get advanced(){
    return !this.state.simple;
  }

  setSimple(){
    let shopping = this;
    if (shopping.simple) return true;
    shopping.setState({
      simple: true
    });
    shopping.updateFootprint({
      input_footprint_shopping_goods_type: 0,
      input_footprint_shopping_goods_other_type: 1,
      input_footprint_shopping_services_type: 0
    });
  }

  setAdvanced(){
    let shopping = this;
    if (shopping.advanced) return true;
    shopping.setState({
      simple: false
    });
    shopping.updateFootprint({
      input_footprint_shopping_goods_type: 1,
      input_footprint_shopping_goods_other_type: 1,
      input_footprint_shopping_services_type: 1
    });
  }

  render(){
    return template.call(this);
  }

  /*
   * Sliders
   */

  expendAverage(type){
    let shopping = this,
        api_key = shopping.apiKey(type);
    return shopping.state_manager.average_footprint[api_key];
  }

  initializeServicesSlider(){
    let shopping = this;

    shopping.services_slider = new SimpleSlider({
      container: '#shopping_services_slider',
      tick_labels: {
        0: '0',
        1: '1x',
        2: '2x',
        3: '3x',
        4: '4x',
        5: '5x',
      },
      onChange: (multiplier)=>{
        let service_state = {},
          update_params = SERVICES_QUESTIONS.reduce((hash, service_type)=>{
            let api_key = shopping.apiKey(service_type),
                new_value = multiplier * shopping.expendAverage(service_type);
            service_state[service_type] = new_value;
            hash[api_key] = new_value;
            return hash;
          }, {}),
          services_total = multiplier * shopping.average_services_expend;
        update_params['input_footprint_shopping_services_total'] = services_total;
        shopping.setState(service_state);
        shopping.updateFootprint(update_params);
      }
    });
    shopping.services_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: 1
    });
  }

  initializeGoodsSlider(){
    let shopping = this;

    shopping.services_slider = new SimpleSlider({
      container: '#shopping_goods_slider',
      tick_labels: {
        0: '0',
        1: '1x',
        2: '2x',
        3: '3x',
        4: '4x',
        5: '5x',
      },
      onChange: (multiplier)=>{
        let goods_state = {},
          update_params = GOODS_QUESTIONS.reduce((hash, goods_type)=>{
            let api_key = shopping.apiKey(goods_type),
                new_value = multiplier * shopping.expendAverage(goods_type);
            goods_state[goods_type] = new_value;
            hash[api_key] = new_value;
            return hash;
          }, {}),
          services_total = multiplier * shopping.average_goods_expend;
        update_params['input_footprint_shopping_goods_total'] = services_total;
        shopping.setState(goods_state);
        shopping.updateFootprint(update_params);
      }
    });
    shopping.services_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: 1
    });
  }

}

ShoppingComponent.propTypes = {

};
ShoppingComponent.contextTypes = {
  i18n: React.PropTypes.any
}

ShoppingComponent.NAME = 'Shopping';

module.exports = ShoppingComponent;
