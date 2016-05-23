/*global module*/

import React from 'react';
import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';

import Panel from './../../lib/base_classes/panel';
import template from './home.rt.html'

const RELEVANT_API_KEYS = [
  'watersewage', 'cleanpercent', 'squarefeet',
  'electricity_dollars', 'electricity_kwh', 'electricity_type',
  'naturalgas_dollars', 'naturalgas_therms', 'naturalgas_cuft', 'naturalgas_type',
  'heatingoil_dollars', 'heatingoil_gallons', 'heatingoil_type'
];

class HomeComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let home = this,
        water_api_key = home.apiKey('watersewage');
    home.state = home.userApiState();
  }

  get api_key_base(){
    return 'input_footprint_housing';
  }

  get display_annual_water_dollars(){
    return Math.round(this.state['input_footprint_housing_watersewage'])
  }

  get relevant_api_keys(){
    return RELEVANT_API_KEYS;
  }

  userCategoryInput(key_end){
    let home = this;
    return home.userApiValue(home.apiKey(key_end));
  }

  defaultCategoryInput(key_end){
    let home = this;
    return home.defaultApiValue(home.apiKey(key_end));
  }

  /*
   * React Events
   */

  componentDidMount() {
    let home = this;
    home.initializeWaterSlider();
    home.initializeCleanPercentSlider();
  }

  render(){
    return template.call(this);
  }

  /*
   * Toggling Units
   */

  unitsSet(category, value){
    let home = this,
        api_key = home.apiKey(category + '_type'),
        set_value = home.userApiValue(api_key);
    return parseInt(set_value) === parseInt(value);
  }

  setUnits(event){
    let home = this,
        api_key = event.target.dataset.api_key,
        update = { [api_key]: event.target.value };
    home.setState(update);
    home.updateFootprintParams(update);
  }

  /*
   * Water Slider
   */

  initializeWaterSlider(){
    let home = this;

    home.water_slider = new SimpleSlider({
      container: '#home_watersewage_slider',
      tick_labels: {
        0: '0',
        1: '1x',
        2: '2x',
        3: '3x',
        4: '4x',
        5: '5x',
      },
      onChange: (multiplier)=>{
        let api_key = home.apiKey('watersewage'),
            default_watersewage = home.defaultApiValue(api_key),
            update = {
              [api_key]: multiplier * parseFloat(default_watersewage)
            };
        home.setState(update);
        home.updateFootprint(update);
      }
    });
    home.water_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: 1
    });
  }

  initializeCleanPercentSlider(){
    let home = this,
        cleanpercent_api_key = home.apiKey('cleanpercent');

    home.water_slider = new SimpleSlider({
      container: '#home_cleanpercent_slider',
      tick_values: [0, 20, 40, 60, 80, 100],
      onChange: (cleanpercent)=>{
        let api_key = home.apiKey('cleanpercent'),
            update = {
              [api_key]: cleanpercent
            };

        home.setState(update);
        home.updateFootprint(update);
      }
    });
    home.water_slider.drawData({
      abs_min: 0,
      abs_max: 100,
      current_value: home.userApiValue(cleanpercent_api_key)
    });
  }

}

HomeComponent.NAME = 'Home';

module.exports = HomeComponent;
