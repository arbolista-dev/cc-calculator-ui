/*global module clearTimeout setTimeout window*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './get_started.rt.html'
import SnapSlider from 'd3-object-charts/src/slider/snap_slider';
import CalculatorApi from 'api/calculator.api';
import { setLocation } from 'api/user.api';
import footprintContainer from 'shared/containers/footprint.container';
import { footprintPropTypes } from 'shared/containers/footprint.container';

const LOCATION_MODES = [[5, 'Country'], [1, 'Zipcode'], [4, 'State'], [2, 'City'], [3, 'County']];
const DEFAULT_LOCATION = {input_location_mode: 5, input_income: 1, input_size: 0};

class GetStartedComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let get_started = this;
    get_started.initResizeListener();
    get_started.state = {
      locations: {},
      input_location_mode: parseInt(get_started.input_location_mode),
      show_location_suggestions: false
    };
  }

  componentDidMount(){
    let get_started = this;
    get_started.initializeSizeSlider();
    get_started.initializeIncomeSlider();
  }

  componentDidUpdate(){
    let component = this;
    if (component.input_income != component.income_slider.current_value){
      component.income_slider.setValue(component.input_income);
    }
    if (component.input_size != component.size_slider.current_value){
      component.size_slider.setValue(component.input_size);
    }
  }

  render(){
    return template.call(this);
  }

  /*
   * Location UI
   */

  get input_location_mode(){
    return this.userApiValue('input_location_mode');
  }

  get country_mode(){
    return this.state.input_location_mode === 5;
  }

  get input_location_display(){
    let get_started = this,
        display_location = get_started.props.ui.get('display_location');

    if (get_started.country_mode){
      return get_started.t('get_started.United States');
    } else if (display_location) {
      return display_location;
    } else {
      return this.userApiValue('input_location');
    }
  }

  get default_location(){
    return DEFAULT_LOCATION;
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
    let params = Object.assign({}, get_started.getDefaultInputs(), default_params);

    // debounce updating defaults by 500ms.
    if (get_started.$update_defaults) {
      clearTimeout(get_started.$update_defaults);
    }

    get_started.$update_defaults = setTimeout(()=>{
      get_started.props.ensureDefaults(params)
      if (get_started.user_authenticated) {
        get_started.state_manager.updateUserAnswers(get_started.getUserFootprint(), get_started.props.auth.getIn(['data', 'token']))
      }
    }, 500);
  }

  locationModeActive(mode){
    return this.state.input_location_mode === mode;
  }

  setLocationMode(location_mode){
    let get_started = this;
    if (location_mode !== get_started.state.input_location_mode){
      let ui = {
        id: 'display_location',
        data: ''
      };
      get_started.props.updateUI(ui);
    }
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
      display_location: suggestion,
      input_location: suggestion,
      show_location_suggestions: false
    });

    let ui = {
      id: 'display_location',
      data: suggestion
    };
    get_started.props.updateUI(ui);

    get_started.updateDefaults({input_location: zipcode, input_location_mode: get_started.state.input_location});

    if (get_started.user_authenticated) {
      let index = get_started.state.locations.data.findIndex(l => l === zipcode),
          location_data = get_started.state.locations.selected_location[index];

      get_started.setUserLocation(location_data)
    }
  }

  setUserLocation(location){
    let get_started = this,
        token = get_started.props.auth.getIn(['data', 'token']);

    return setLocation(location, token)
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
    return this.userApiValue('input_income');
  }

  get input_size(){
    return this.userApiValue('input_size');
  }

  initializeSizeSlider(){
    let get_started = this;
    get_started.size_slider = new SnapSlider({
      container: '#size_slider',
      outer_width: get_started.slider_width,
      handle_r: 14,
      tick_labels: {
        0: get_started.t('get_started.average_household_size'),
        1: '1', 2: '2', 3: '3', 4: '4', 5: '5+'
      },
      onSnap: (selected_size)=>{
        if (selected_size != get_started.input_size){
          get_started.updateDefaults({input_size: selected_size});
        }
      }
    });

    get_started.size_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: get_started.input_size
    });
  }

  get income_tick_labels(){
    let get_started = this,
        width = window.innerWidth;
    if (width < 400){
      return {
        1: get_started.t('Avg'),
        2: '|',
        3: '10k',
        4: '|',
        5: '30k',
        6: '|',
        7: '50k',
        8: '|',
        9: '80k',
        10: '|',
        11: '120k+'
      }
    } else {
      return {
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
      }
    }
  }

  initializeIncomeSlider(){
    let get_started = this;

    get_started.income_slider = new SnapSlider({
      container: '#income_slider',
      outer_width: get_started.slider_width,
      tick_labels: get_started.income_tick_labels,
      handle_r: 14,
      onSnap: (selected_income)=>{
        if (selected_income != get_started.input_income){
          get_started.updateDefaults({input_income: selected_income});
        }
      }
    });

    get_started.income_slider.drawData({
      abs_min: 1,
      abs_max: 11,
      current_value: get_started.input_income
    });

  }

  resize(){
    let get_started = this;
    get_started.income_slider.redraw({
      outer_width: get_started.slider_width
    });
    get_started.size_slider.redraw({
      outer_width: get_started.slider_width
    });
  }

}

GetStartedComponent.propTypes = footprintPropTypes;

GetStartedComponent.NAME = 'GetStarted';

module.exports = footprintContainer(GetStartedComponent);
