import { createStore } from 'redux';
import { install, combineReducers } from 'redux-loop';

import locationReducer from 'shared/reducers/location.reducer';


export default class StateManager {

  initializeStore(initial_state){
    let reducer = combineReducers({
      // session: sessionReducer,
      location: locationReducer
    });
    this.store = createStore(reducer, initial_state, install());
  }
}
