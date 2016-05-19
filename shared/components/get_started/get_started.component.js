/*global module*/

import React from 'react';
import SnapSlider from 'd3-object-charts/src/range/snap_slider';

import CalculatorApi from 'api/calculator.api';
import TranslatableComponent from '../translatable/translatable.component';
import template from './get_started.rt.html'

const LOCATION_MODES = [[1, 'Zipcode'], [2, 'City'], [3, 'County'], [4, 'State']];

class GetStartedComponent extends TranslatableComponent {

  constructor(props, context){
    super(props, context);
    let get_started = this;
    get_started.state = {
      location_suggestions: [],
      input_location_mode: props.state_manager.input_location_mode
    }
  }

  /*
   * React Life Cyle
   */

  componentDidMount(){
    let get_started = this;
    get_started.initializeSizeSlider();
    get_started.initializeIncomeSlider();
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('get_started.title');
  }

  get router(){
    return this.props.router;
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

  /*
   * Location UI
   */

  get location_modes(){
    return LOCATION_MODES;
  }

  locationModeActive(mode){
    return this.state.input_location_mode === mode;
  }

  setLocationMode(location_mode){
    let get_started = this;
    get_started.hideLocationSuggestions();
    get_started.setState({
      input_location_mode: location_mode,
      location_suggestions: []
    });
  }

  setLocation(location){
    let get_started = this;
    get_started.hideLocationSuggestions();
    get_started.updateDefaults({input_location: location});
  }

  setLocationSuggestions(event){
    let get_started = this,
        new_location = {
          input_location_mode: get_started.state.input_location_mode,
          input_location: event.target.value
        };

    get_started.setLocation(event.target.value);

        /*
    if (get_started.$set_location_suggestions){
      clearTimeout(get_started.$set_location_suggestions);
    }

    // debounce location suggestions by 500ms.
    get_started.$set_location_suggestions = setTimeout(()=>{
      CalculatorApi.getAutoComplete(new_location)
        .then((res)=>{
          get_started.setState({
            location_suggestions: res.suggestions
          });
        });
    }, 500);*/
  }

  showLocationSuggestions(){
    document.getElementById('get_started_location_suggestions').style.display = 'block';
  }

  hideLocationSuggestions(){
    document.getElementById('get_started_location_suggestions').style.display = 'none';
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
      tick_labels: { 1: '1', 2: '3', 3: '3', 4: '4', 5: '5+' },
      onSnap: function(selected_size) {
        console.log('onSnap', selected_size);
        get_started.updateDefaults({input_size: selected_size});
      }
    });

    get_started.size_slider.drawData({
      abs_min: 1,
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
        console.log('onSnap', selected_income);
        get_started.updateDefaults({input_income: selected_income});
      }
    });

    get_started.income_slider.drawData({
      abs_min: 0,
      abs_max: 12,
      current_value: get_started.input_income
    });

  }

  render(){
    return template.call(this);
  }

}

GetStartedComponent.propTypes = {

};
GetStartedComponent.contextTypes = {
  i18n: React.PropTypes.any
}

GetStartedComponent.NAME = 'GetStarted';

module.exports = GetStartedComponent;
