/*global JS_ENV Map require*/

import CalculatorApi from 'api/calculator.api';

const DEFAULT_LOCATION = {input_location_mode: 5, input_income: 1, input_size: 0};
const DEFAULT_INPUTS = ['input_size', 'input_income', 'input_location', 'input_location_mode'];
const TAKEACTION_INPUTS = ['input_footprint_household_adults', 'input_footprint_household_children'];
const CATEGORY_COLORS = {
  result_transport_total: '#0D7A3E',
  result_housing_total: '#45813C',
  result_food_total: '#5E893C',
  result_goods_total: '#0B713D',
  result_services_total: '#4AAA48'
};


export default class StateManager {

  constructor(){
    var state_manager = this;
    state_manager.state = {average_footprint: {}, user_footprint: {}};
  }

  get category_colors(){
    return CATEGORY_COLORS;
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

  get footprint_not_updated(){
    console.log('input changed', this.user_footprint['input_changed'])
    return this.user_footprint['input_changed'] != 1;
  }

  get actions_not_updated(){
    return this.result_takeaction_pounds === undefined;
  }

  get user_footprint_set(){
    let state_manager = this;
    console.log('user_footprint_set', Object.keys(state_manager.state.user_footprint).length )
    return Object.keys(state_manager.state.user_footprint).length !== 0
  }

  get default_inputs(){
    let state_manager = this,
        location;
    if (!state_manager.user_footprint_set){
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

  get result_takeaction_pounds(){
    return this.state['result_takeaction_pounds']
  }

  get result_takeaction_dollars(){
    return this.state['result_takeaction_dollars']
  }

  get result_takeaction_net10yr(){
    return this.state['result_takeaction_net10yr']
  }

  get inputs(){
    return Object.keys(this.state.user_footprint).reduce((params, key)=>{
      if (/^input_/.test(key) || DEFAULT_INPUTS.indexOf(key) >= 0){
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
        if (!state_manager.user_footprint_set || state_manager.footprint_not_updated){
          state_manager.parseFootrintResult(res);
          return undefined;
        } else {
          // If user footprint has been defined, update it with new location.
          return state_manager.updateFootprint(state_manager.inputs);
        }
      })
      .then(()=>{
        return state_manager.syncLayout();
      });
  }

  // This should be called to update input parameters that don't
  // impact resulting footprint (eg input type).
  updateFootprintParams(params){
    let state_manager = this;
    state_manager.user_footprint['input_changed'] = 1;
    Object.assign(state_manager.user_footprint, params);
  }

  updateFootprint(){
    let state_manager = this;

    return CalculatorApi.computeFootprint(state_manager.inputs)
      .then((res)=>{
        state_manager.parseFootrintResult(res);
        return undefined;
      })
      .then(()=>{
        return state_manager.syncLayout();
      });
  }

  parseFootrintResult(result){
    // compute footprint and default calls will 0 out take action inputs/results.
    // do not override those values for user_footprint.
    let state_manager = this;

    if (state_manager.actions_not_updated){
      console.log('also getting actions results')
      state_manager.parseTakeactionResult(result);
    } else {
      console.log('no need for action results')
      result = Object.keys(result).reduce((hash, api_key)=>{
        if (!/^(result|input)_takeaction/.test(api_key)){
          hash[api_key] = result[api_key]
        }
        return hash;
      }, {});
      console.log(result)
      Object.assign(state_manager.state.user_footprint, result);
    }

  }

  /*
   * Takeaction Results
   */

  updateTakeactionResults(){
    let state_manager = this;

    return CalculatorApi.computeTakeactionResults(state_manager.user_footprint)
      .then((res)=>{
        state_manager.parseTakeactionResult(res);
        return undefined;
      })
      .then(()=>{
        return state_manager.syncLayout();
      });
  }

  parseTakeactionResult(result){
    let state_manager = this;
    Object.assign(state_manager.state.user_footprint, result);
    console.log('footprint set?', state_manager.user_footprint_set)
    state_manager.state['result_takeaction_pounds'] = JSON.parse(result['result_takeaction_pounds']);
    state_manager.state['result_takeaction_dollars'] = JSON.parse(result['result_takeaction_dollars']);
    state_manager.state['result_takeaction_net10yr'] = JSON.parse(result['result_takeaction_net10yr']);
  }

}
