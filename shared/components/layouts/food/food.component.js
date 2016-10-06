/*global module*/

import React from 'react';
import { upperFirst as _upperFirst } from 'lodash';
import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';

import Panel from 'shared/lib/base_classes/panel';
import template from './food.rt.html'
import footprintContainer from 'shared/containers/footprint.container';
import { footprintPropTypes } from 'shared/containers/footprint.container';

const RELEVANT_API_KEYS = ['meatfisheggs', 'meat_beefpork', 'meat_fish', 'meat_other', 'meat_poultry',
                    'cereals', 'dairy', 'fruitvegetables', 'otherfood'],
    MEAT_TYPES = ['meat_beefpork', 'meat_fish', 'meat_other', 'meat_poultry'],
    AVERAGE_HOUSEHOLD_SIZE = 2.5;

class FoodComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let food = this;
    food.sliders = [];
    food.initResizeListener();
    food.state = Object.assign({
      simple: true
    }, food.userApiState());
  }

  get api_key_base(){
    return 'input_footprint_shopping_food';
  }

  get relevant_api_keys(){
    return RELEVANT_API_KEYS;
  }

  getFoodLabel(type) {
    return this.t(`food.${type}.label`);
  }

  toggleLeadersChart() {
    let food = this,
        ui = {};

    ui.id = 'leaders_chart';
    ui.data = {
      show: true,
      category: 'food'
    };
    food.props.updateUI(ui);
    window.jQuery('html, body').animate({ scrollTop: $('.cc_leaders').offset().top }, 1000);
  }

  /*
   * React Events
   */

  render(){
    return template.call(this);
  }

  componentDidMount(){
    let food = this;
    RELEVANT_API_KEYS.forEach((food_type)=>{
      food.initializeSlider(food_type)
    });
  }

  /*
   * Simple/Advanced
   */

  get simple(){
    return this.state.simple;
  }

  get advanced(){
    return !this.simple
  }

  shouldShow(food_type){
    let food = this;
    if (food.simple){
      return MEAT_TYPES.indexOf(food_type) < 0;
    } else if (food_type === 'meatfisheggs'){
      return false;
    }
    return true;
  }

  setSimple(){
    let food = this;
    if (food.simple) return true;
    food.setState({
      simple: true
    });
    food.updateFootprintParams({
      input_footprint_shopping_food_meattype: 0
    });
  }

  setAdvanced(){
    let food = this;
    if (food.advanced) return true;
    food.setState({
      simple: false
    });
    food.updateFootprintParams({
      input_footprint_shopping_food_meattype: 1
    });
  }

  /*
   * Food Sliders
   */

  get household_size(){
    let size = parseInt(this.userApiValue('input_size'));
    return size === 0 ? AVERAGE_HOUSEHOLD_SIZE : size;
  }

  displayUserCalories(food_type){
    let api_key = this.apiKey(food_type),
        daily_household_calories = this.userApiValue(api_key),
        daily_user_calories = daily_household_calories / this.household_size;
    return Math.round(daily_user_calories);
  }

  initializeSlider(food_type){
    let food = this,
        api_key = food.apiKey(food_type),
        default_value = food.defaultApiValue(api_key);

    food.sliders[food_type] = new SimpleSlider({
      container: '#food_average_slider_' + food_type,
      outer_height: 60,
      outer_width: food.slider_width,
      margin: {left: 10, right: 15, top: 0, bottom: 10},
      handle_r: 15,
      tick_labels: {
        0: '0',
        1: _upperFirst(food.t('average')),
        2: '2x',
        3: '3x',
        4: '4x',
        5: '5x',
      },
      onChange: (multiplier)=>{
        if (food_type === 'meatfisheggs'){
          food.distributeAverageMeatCalories(multiplier);
        } else {
          let update = {
            [api_key]: food.applyAverageCalorieMultiplier(food_type, multiplier)
          }
          food.setState(update);
          food.updateFootprint(update);
        }
      }
    });
    food.sliders[food_type].drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: food.userApiValue(api_key) / default_value
    });
  }

  resize(){
    let food = this;
    Object.keys(food.sliders).forEach((food_type)=>{
      let slider = food.sliders[food_type];
      slider.redraw({
        outer_width: food.slider_width
      });
    });
  }

  distributeAverageMeatCalories(multiplier){
    let food = this,
        update_params = MEAT_TYPES.reduce((hash, meat_type)=>{
          let api_key = food.apiKey(meat_type),
              calories = food.applyAverageCalorieMultiplier(meat_type, multiplier);
          food.sliders[meat_type].setValue(multiplier, {exec_callback: false});
          hash[api_key] = calories;
          return hash;
        }, {}),
        total_api_key = food.apiKey('meatfisheggs'),
        total_meat = food.applyAverageCalorieMultiplier('meatfisheggs', multiplier);
    update_params[total_api_key] = total_meat;

    food.setState(update_params);
    food.updateFootprint(update_params);
  }

  applyAverageCalorieMultiplier(food_type, multiplier){
    let food = this,
        api_key = food.apiKey(food_type),
        calorie_average = food.defaultApiValue(api_key);
    return multiplier * calorie_average;
  }

}

FoodComponent.propTypes = footprintPropTypes;
FoodComponent.NAME = 'Food';

module.exports = footprintContainer(FoodComponent);
