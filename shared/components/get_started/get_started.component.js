/*global module*/

import React from 'react';
import SnapSlider from 'd3-object-charts/src/slider/snap_slider';

import Panel from './../../lib/base_classes/panel';
import template from './get_started.rt.html'
import CalculatorApi from 'api/calculator.api';

const LOCATION_MODES = [[1, 'Zipcode'], [2, 'City'], [3, 'County'], [4, 'State'], [5, 'Country']];

class GetStartedComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let get_started = this;
    get_started.state = {
      locations: {},
      input_location_mode: parseInt(get_started.state_manager.input_location_mode),
      input_location: get_started.userApiValue('input_location'),
      show_location_suggestions: false
    }
  }

  /*
   * React Events
   */

  componentDidMount(){
    let get_started = this;
    get_started.initializeSizeSlider();
    get_started.initializeIncomeSlider();
  }

  render(){
    return template.call(this);
  }

  /*
   * Location UI
   */

   get country_mode(){
    return this.state.input_location_mode === 5;
   }

   get input_location_display(){
    let get_started = this;
    if (get_started.country_mode){
      return get_started.t('get_started.United States');
    } else {
      return get_started.state.input_location;
    }
   }

  get location_modes(){
    return LOCATION_MODES;
  }

  get show_location_suggestions(){
    return this.state.show_location_suggestions;
  }

  updateDefaults(default_params){
    let get_started = this;

    default_params.input_location_mode = get_started.state.input_location_mode;
    get_started.state_manager.updateDefaultParams(default_params)

    // debounce updating defaults by 500ms.
    if (get_started.$update_defaults) {
      clearTimeout(get_started.$update_defaults);
    }

    get_started.$update_defaults = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      get_started.state_manager.updateDefaults();
    }, 500);
  }

  locationModeActive(mode){
    return this.state.input_location_mode === mode;
  }

  setLocationMode(location_mode){
    let get_started = this;
    get_started.setState({
      input_location_mode: location_mode,
      input_location: undefined,
      locations: {},
      show_location_suggestions: false
    });
  }

  // called when location suggestion is clicked.
  setLocation(event){
    let get_started = this,
        zipcode = event.target.dataset.zipcode,
        suggestion = event.target.dataset.suggestion;
    get_started.setState({
      input_location: suggestion,
      show_location_suggestions: false
    });
    get_started.updateDefaults({input_location: zipcode});
  }

  // called when input_location input changed.
  setLocationSuggestions(event){
    if (this.country_mode) return false;
    let get_started = this,
        new_location = {
          input_location_mode: get_started.state.input_location_mode,
          input_location: event.target.value
        };
    get_started.setState({
      input_location: event.target.value,
      show_location_suggestions: true
    });

    if (get_started.$set_location_suggestions){
      clearTimeout(get_started.$set_location_suggestions);
    }

    // debounce location suggestions by 500ms.
    get_started.$set_location_suggestions = setTimeout(()=>{
      CalculatorApi.getAutoComplete(new_location)
        .then((locations)=>{
          get_started.setState({
            locations: locations,
            show_location_suggestions: true
          });
        });
    }, 500);
  }

  showLocationSuggestions(){
    this.setState({
      show_location_suggestions: true
    });
  }

  hideLocationSuggestions(){
    this.setState({
      show_location_suggestions: false
    });
  }

  /*
   * Income and Household Size UI
   */

   get input_income(){
      return this.state_manager.state.user_footprint['input_income']
   }

   get input_size(){
      return this.state_manager.state.user_footprint['input_size']
   }

  initializeSizeSlider(){
    let get_started = this;
    get_started.size_slider = new SnapSlider({
      container: '#size_slider',
      tick_labels: {
        0: get_started.t('get_started.average_household_size'),
        1: '1', 2: '2', 3: '3', 4: '4', 5: '5+'
      },
      onSnap: function(selected_size) {
        get_started.updateDefaults({input_size: selected_size});
      }
    });

    get_started.size_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: get_started.input_size
    });

  }

  initializeIncomeSlider(){
    let get_started = this;

    get_started.income_slider = new SnapSlider({
      container: '#income_slider',
      tick_labels: {
        1: get_started.t('Avg'),
        2: '<10k',
        3: '10k',
        4: '20k',
        5: '30k',
        6: '40k',
        7: '50k',
        8: '60k',
        9: '80k',
        10: '100k',
        11: '120k+'
      },
      onSnap: function(selected_income) {
        get_started.updateDefaults({input_income: selected_income});
      }
    });

    get_started.income_slider.drawData({
      abs_min: 1,
      abs_max: 11,
      current_value: get_started.input_income
    });

  }

}

GetStartedComponent.NAME = 'GetStarted';

module.exports = GetStartedComponent;
