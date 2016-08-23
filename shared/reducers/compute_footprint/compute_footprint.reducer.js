import * as Immutable from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createAction, createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';

const ensureComputeFootprint = createAction('Ensure compute footprint results from Calc API are in store.'),
    computeFootprintRetrieved = createAction('Compute footprint results retrieved from Calc API.'),
    computeFootprintRetrievalError = createAction('Error retrieving compute footprint results from Calc API.');

export { ensureComputeFootprint };

const ACTIONS = {

  // Load initial defaults from API.
  [ensureComputeFootprint]: (init_data, defaults)=>{
    return loop(
      null,
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(defaults)
          .then(computeFootprintRetrieved)
          .catch(computeFootprintRetrievalError)
      })
    )
  },

  [computeFootprintRetrieved]: (_init_data, api_data)=>{
    // return Immutable.fromJS({average_footprint, api_data})
    return loop(
        null,
        fromJS({average_footprint: api_data}),
        parseFootprintResult(api_data)
    )
  },

  [computeFootprintRetrievalError]: (_init_data, _result)=>{
    // @ToDo: create error functions
    return Immutable.fromJS({load_error: true});
  },

  [parseFootprintResult]: (_init_data, data)=>{
    let result = Object.keys(data).reduce((hash, api_key)=>{
      if (!/^(result|input)_takeaction/.test(api_key)){
        hash[api_key] = result[api_key]
      }
      return hash;
    }, {});
    return Immutable.fromJS({user_footprint: result })
  }


};

const REDUCER = createReducer(ACTIONS, 0);

export default REDUCER;
