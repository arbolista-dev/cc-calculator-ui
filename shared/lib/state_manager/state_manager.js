/*global JS_ENV Map require*/

import CalculatorApi from 'api/calculator.api';

const DEFAULT_LOCATION = {input_location_mode: 5, input_income: 1, input_size: 0};
const DEFAULT_INPUTS = ['input_size', 'input_income', 'input_location', 'input_location_mode'];

export default class StateManager {

  constructor(){
    var state_manager = this;
    state_manager.state = {average_footprint: undefined, user_footprint: undefined};
  }

  get params(){
    return this.state.route.params;
  }

  get user_footprint(){
    return this.state.user_footprint;
  }

  get average_footprint(){
    return this.state.average_footprint;
  }

  get cool_climate_keys(){
    return Object.keys(this.state.user_footprint)
  }

  get inputs(){
    return Object.keys(this.state.user_footprint).reduce((params, key)=>{
      if (/^input_footprint/.test(key) || DEFAULT_INPUTS.indexOf(key) >= 0){
        params[key] = this.state.user_footprint[key];
      }
      return params;
    }, {});
  }

  setRoute(route){
    let state_manager = this;
    state_manager.state.route = route;
    return Promise.resolve();
  }

  getInitialData(){
    let state_manager = this;
    // we'll load past user answers and get CC results here.
    return state_manager.updateDefaults();
  }

  syncLayout(){
    let state_manager = this;
    if (state_manager.layout !== undefined){
      return state_manager.layout.syncFromStateManager();
    } else {
      return undefined;
    }
  }

  get default_inputs(){
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

  updateDefaultParams(new_location){
    let state_manager = this;
    Object.assign(state_manager.state.average_footprint, new_location);
    Object.assign(state_manager.state.user_footprint, new_location);
  }

  updateDefaults(){
    let state_manager = this;

    return CalculatorApi.getDefaultsAndResults(state_manager.default_inputs)
      .then((res)=>{
        state_manager.state.average_footprint = res;
        if (state_manager.state.user_footprint === undefined){
          state_manager.state.user_footprint = Object.assign({}, res);
          return undefined
        } else {
          // If user footprint has been defined, update it with new location.
          return state_manager.updateFootprint(state_manager.inputs);
        }
      })
      .then(()=>{
        return state_manager.syncLayout();
      });
  }

  updateFootprintParams(params){
    let state_manager = this;
    Object.assign(state_manager.state.user_footprint, params);
  }

  updateFootprint(){
    let state_manager = this,
        input = Object.assign({input_changed: 1}, state_manager.inputs);
    Object.assign(state_manager.state.user_footprint, {input_changed: 1});
    return CalculatorApi.computeFootprint(input)
      .then((res)=>{
        Object.assign(state_manager.state.user_footprint, res);
        return undefined;
      })
      .then(()=>{
        return state_manager.syncLayout();
      });
  }

}
