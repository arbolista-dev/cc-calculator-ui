import { createStore } from 'redux';
import { install, combineReducers } from 'redux-loop';
import { fromJS } from 'immutable';

import Router from 'shared/lib/router/router';
import locationReducers from 'shared/reducers/location/location.reducers';
import defaultsReducers from 'shared/reducers/average_footprint/average_footprint.reducers';
import computeFootprintReducers from 'shared/reducers/user_footprint/user_footprint.reducers';
import authReducers from 'shared/reducers/auth/auth.reducers';

// import CalculatorApi from 'api/calculator.api';
// import { updateAnswers } from 'api/user.api';
import { tokenIsValid, getLocalStorageItem } from '../utils/utils';

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
    state_manager.state = {
      chart: {
        show: true,
        type: 'bar'
      }
    };
  }

  get Router(){
    return Router;
  }

  get default_inputs(){
    return DEFAULT_LOCATION;
  }

  get category_colors(){
    return CATEGORY_COLORS;
  }

  get user_footprint_storage(){
    return getLocalStorageItem('user_footprint');
  }

  get average_footprint_storage(){
    return getLocalStorageItem('average_footprint');
  }

  get take_action_storage(){
    return getLocalStorageItem('take_action');
  }

  get auth_storage(){
    return getLocalStorageItem('auth');
  }

  initializeStore(initial_state){
    let state_manager = this;
    let reducer = combineReducers({
      location: locationReducers,
      average_footprint: defaultsReducers,
      user_footprint: computeFootprintReducers,
      auth: authReducers
    });
    console.log('initializeStore initial_state', initial_state);
    state_manager.store = createStore(reducer, initial_state, install());

    // @ToDo: use this to persist state to localStorage, needed?
    // store.subscribe(() => {
    //   saveState({
    //      user_footprint: store.getState().user_footprint
    //    });
    // });
  }

  initialState(opts){
    let state_manager = this,
        average_footprint_state;
    return Object.assign({
      auth: fromJS({data: state_manager.auth_storage || {}}),
      average_footprint: fromJS({data: state_manager.average_footprint_storage || state_manager.default_inputs}),
      user_footprint:  fromJS({data: state_manager.user_footprint_storage || {}}),
      result_takeaction_dollars: fromJS(state_manager.take_action_storage.dollars || {}),
      result_takeaction_net10yr: fromJS(state_manager.take_action_storage.net10yr || {}),
      result_takeaction_pounds:  fromJS(state_manager.take_action_storage.pounds || {})
    }, opts);
  }

  getInitialData(){
    let state_manager = this;

    // @ToDo Refactor:
    // state_manager.receiveExternalOffset()

    // we'll load past user answers and get CC results here.
    return state_manager.checkLocalStorage();
  }

  checkLocalStorage(){
    let state_manager = this;
    return Promise.resolve();
  }

  // @ToDo Refactor:
  //
  // get cool_climate_keys(){
  //   return Object.keys(this.state.user_footprint)
  // }
  //
  // get footprint_not_updated(){
  //   return this.user_footprint['input_changed'] != 1;
  // }
  //
  // get actions_not_updated(){
  //   return this.result_takeaction_pounds === undefined;
  // }
  //
  // get result_takeaction_pounds(){
  //   return this.state['result_takeaction_pounds']
  // }
  //
  // get result_takeaction_dollars(){
  //   return this.state['result_takeaction_dollars']
  // }
  //
  // get result_takeaction_net10yr(){
  //   return this.state['result_takeaction_net10yr']
  // }
  // get user_authenticated(){
  //   if (this.state.auth.hasOwnProperty('token')) {
  //     return tokenIsValid(this.state.auth.token);
  //   } else {
  //     return false;
  //   }
  // }

  // @ToDo Refactor:
  // setConnectToApi(){
  //   let state_manager = this;
  //   if (state_manager.state.external_offset.hasOwnProperty('connect_to_api')) {
  //     if (!state_manager.state.external_offset.connect_to_api) {
  //       state_manager.state.connect_to_api = false;
  //     }
  //   }
  // }


  // @ToDo Refactor:
  // receiveExternalOffset() {
  //   let state_manager = this;
  //
  //   window.addEventListener('message', ((event) => {
  //     // optional origin check:
  //     // if(event.origin !== 'http://localhost:8080') return;
  //
  //     try {
  //       let data = JSON.parse(event.data);
  //       if (data.carbon_price_per_ton) {
  //         Object.assign(state_manager.state.external_offset, data);
  //         state_manager.setConnectToApi();
  //         state_manager.syncLayout();
  //       }
  //     } catch (e) {
  //       // console.log('receiveExternalOffset err: ', e);
  //     }
  //
  //   }),false);
  //
  // }


  // @ToDo - Check which methods are still needed within State Manager
  // setUserFootprint(answers) {
  //   let state_manager = this;
  //   Object.assign(state_manager.state.user_footprint, answers)
  //   state_manager.updateUserFootprintStorage();
  //   state_manager.parseFootprintResult(state_manager.state.user_footprint);
  // }
  //
  // setUserFootprintStorageToDefault() {
  //   let state_manager = this;
  //   localStorage.removeItem('user_footprint');
  //   state_manager.state.user_footprint = {};
  //   return state_manager.updateDefaults().then(() => {
  //     // User footprint reset!
  //     state_manager.syncLayout().then(() => {
  //     });
  //   })
  // }
  //
  // updateAverageFootprintStorage() {
  //   let state_manager = this;
  //   localStorage.setItem('average_footprint', JSON.stringify(state_manager.state.average_footprint));
  // }
  //
  // updateTakeActionResultStorage() {
  //   let state_manager = this;
  //   localStorage.setItem('result_takeaction_dollars', JSON.stringify(state_manager.state['result_takeaction_dollars']));
  //   localStorage.setItem('result_takeaction_net10yr', JSON.stringify(state_manager.state['result_takeaction_net10yr']));
  //   localStorage.setItem('result_takeaction_pounds', JSON.stringify(state_manager.state['result_takeaction_pounds']));
  // }
  //
  // // This should be called to update input parameters that don't
  // // impact resulting footprint (eg input_footprint_housing_electricity_type).
  // updateFootprintParams(params){
  //   let state_manager = this;
  //   state_manager.user_footprint['input_changed'] = 1;
  //   Object.assign(state_manager.user_footprint, params);
  // }
  //
  // updateFootprint(){
  //   let state_manager = this;
  //   return CalculatorApi.computeFootprint(state_manager.inputs)
  //     .then((res)=>{
  //       state_manager.parseFootprintResult(res);
  //       state_manager.updateUserFootprintStorage();
  //       if (state_manager.user_authenticated) state_manager.updateUserAnswers();
  //       return undefined;
  //     });
  // }
  //
  // logDifferences(input, output){
  //   let state_manager = this,
  //       keys = Object.keys(input).sort(),
  //       differences = [];
  //       keys.forEach((key)=>{
  //         let in_v = input[key],
  //             out_v = output[key];
  //         if (in_v !== out_v && out_v){
  //           differences.push([key, in_v, out_v])
  //         }
  //       });
  //
  //   // console.log(JSON.stringify(differences, null, 2))
  // }
  //
  // parseFootprintResult(result){
  //   // compute footprint and default calls will 0 out take action inputs/results.
  //   // do not override those values for user_footprint.
  //   let state_manager = this;
  //
  //   if (state_manager.actions_not_updated){
  //     state_manager.parseTakeactionResult(result);
  //   } else {
  //     result = Object.keys(result).reduce((hash, api_key)=>{
  //       if (!/^(result|input)_takeaction/.test(api_key)){
  //         hash[api_key] = result[api_key]
  //       }
  //       return hash;
  //     }, {});
  //     Object.assign(state_manager.state.user_footprint, result);
  //   }
  //   state_manager.updateUserFootprintStorage();
  // }
  //
  // /*
  //  * Takeaction Results
  //  */
  //
  // get total_vehicle_miles(){
  //   let sum = 0;
  //   for (let i=1; i<=10; i++){
  //     sum += this.user_footprint[`input_footprint_transportation_miles${i}`];
  //   }
  //   return sum;
  // }
  //
  // updateTakeactionResults(){
  //   let state_manager = this,
  //       action_inputs = Object.assign({}, state_manager.average_footprint, state_manager.user_footprint);
  //
  //   return CalculatorApi.computeTakeactionResults(action_inputs)
  //     .then((res)=>{
  //       state_manager.parseTakeactionResult(res);
  //       state_manager.updateUserFootprintStorage();
  //       return undefined;
  //     })
  //     .then(()=>{
  //       return state_manager.syncLayout();
  //     });
  // }
  //
  // parseTakeactionResult(result){
  //   let state_manager = this;
  //   Object.assign(state_manager.state.user_footprint, result);
  //   state_manager.state['result_takeaction_pounds'] = JSON.parse(result['result_takeaction_pounds']);
  //   state_manager.state['result_takeaction_dollars'] = JSON.parse(result['result_takeaction_dollars']);
  //   state_manager.state['result_takeaction_net10yr'] = JSON.parse(result['result_takeaction_net10yr']);
  //   state_manager.updateTakeActionResultStorage();
  // }
  //
  // /*
  //  * User API
  //  */
  // updateUserAnswers(){
  //   let state_manager = this,
  //       token = state_manager.state.auth.token;
  //
  //   return updateAnswers(state_manager.user_footprint, token)
  //           .then((res) => {
  //             // if (res.success) console.log('Updated user answers in DB.');
  //           })
  // }

}
