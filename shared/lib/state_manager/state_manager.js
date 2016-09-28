import { createStore } from 'redux';
import { install, combineReducers } from 'redux-loop';
import { fromJS } from 'immutable';

import Router from 'shared/lib/router/router';
import locationReducers from 'shared/reducers/location/location.reducers';
import defaultsReducers from 'shared/reducers/average_footprint/average_footprint.reducers';
import computeFootprintReducers from 'shared/reducers/user_footprint/user_footprint.reducers';
import authReducers from 'shared/reducers/user/user.reducers';
import uiReducers from 'shared/reducers/ui/ui.reducers';

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
    let state_manager = this;
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

  get default_ui_state(){
    let ui_state = {
      leaders_chart: {
        show: false,
        category: ''
      },
      alerts: {
        sign_up: [],
        login: [],
        forgot_password: [],
        leaders: [],
        shared: []
      },
      connect_to_api: true,
      external_offset: {}
    }
    return ui_state
  }

  initializeStore(initial_state){
    let state_manager = this;
    let reducer = combineReducers({
      location: locationReducers,
      average_footprint: defaultsReducers,
      user_footprint: computeFootprintReducers,
      auth: authReducers,
      ui: uiReducers
    });
    state_manager.store = createStore(reducer, initial_state, install());
  }

  initialState(opts){
    let state_manager = this,
        average_footprint_state;

    console.log('initialState call');

    return Object.assign({
      auth: fromJS({data: state_manager.auth_storage || {}}),
      average_footprint: fromJS({data: state_manager.average_footprint_storage || state_manager.default_inputs}),
      user_footprint:  fromJS({
        data: state_manager.user_footprint_storage || {},
        result_takeaction_dollars: state_manager.take_action_storage.dollars || {},
        result_takeaction_net10yr: state_manager.take_action_storage.net10yr || {},
        result_takeaction_pounds:  state_manager.take_action_storage.pounds || {}
      }),
      ui: fromJS(state_manager.default_ui_state)
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
