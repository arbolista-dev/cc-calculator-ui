import * as Immutable from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createAction, createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';

const ensureDefaults = createAction('Ensure defaults from Calc API are in store.'),
    defaultsRetrieved = createAction('Defaults retrieved from Calc API.'),
    defaultsRetrievalError = createAction('Error retrieving defaults from Calc API.');

export { ensureDefaults };

const ACTIONS = {

  // Load initial defaults from API.
  [ensureDefaults]: (default_data, default_inputs)=>{
    return loop(
      null,
      Effects.promise(()=>{
        return CalculatorApi.getDefaultsAndResults(default_inputs)
          .then(defaultsRetrieved)
          .catch(defaultsRetrievalError)
      })
    )
  },

  [defaultsRetrieved]: (_defaults_data, api_data)=>{
    return loop(
      fromJS({average_footprint: api_data}),
      // @ToDo: import action and pass in constant
      Effects.constant()
    )
  },

  [defaultsRetrievalError]: (_defaults_data, _result)=>{
    // @ToDo: create error functions
    return Immutable.fromJS({load_error: true});
  }


};

const REDUCER = createReducer(ACTIONS, 0);

export default REDUCER;
