/*global JS_ENV Map require*/

import CalculatorApi from 'api/calculator.api';

const DEFAULT_LOCATION = {input_location_mode: 5, input_income: 1, input_size: 0};

export default class StateManager {

  constructor(){
    var state_manager = this;
    state_manager.state = {average_footprint: undefined, user_footprint: undefined};
  }

  get params(){
    return this.state.route.params;
  }

  get cool_climate_keys(){
    return Object.keys(this.state.user_footprint)
  }

  get inputs(){
    return this.state.user_footprint;
  }

  get location_inputs(){
    let state_manager = this,
        location;
    if (state_manager.state.user_footprint === undefined){
      location = DEFAULT_LOCATION;
    } else {
      location = {
        input_location_mode: state_manager.input_location_mode,
        input_location: state_manager.state.user_footprint['input_location'],
        input_income: state_manager.state.user_footprint['input_income'],
        input_size: state_manager.state.user_footprint['input_size']
      };
    }
    return location;
  }

  get input_location_mode(){
    return this.state.user_footprint['input_location_mode'];
  }

  setRoute(route){
    let state_manager = this;
    state_manager.state.route = route;
    return Promise.resolve();
  }

  updateDefaultsAndResults(new_location){
    let state_manager = this,
        location_input = Object.assign({}, state_manager.location_inputs, new_location);

    return CalculatorApi.getDefaultsAndResults(location_input)
      .then((res)=>{
        state_manager.state.average_footprint = res;
        if (state_manager.state.user_footprint === undefined){
          state_manager.state.user_footprint = res;
          return undefined
        } else {
          // If user footprint has been defined, update it with new location.
          return state_manager.updateFootprint(new_location);
        }
      });
  }

  updateFootprint(new_input){
    let state_manager = this,
        input = Object.assign({}, state_manager.inputs, new_input);
    return CalculatorApi.computeFootprint(input)
      .then((res)=>{
        state_manager.state.user_footprint = res;
        return undefined;
      });
  }


  getInitialData(){
    let state_manager = this;
    // we'll load past user answers and get CC results here.
    return state_manager.updateDefaultsAndResults({});
  }


}
