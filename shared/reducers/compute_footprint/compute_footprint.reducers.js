import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureComputeFootprint, computeFootprintRetrieved, computeFootprintRetrievalError, parseFootprintResult } from './compute_footprint.actions'

const ACTIONS = {

  // Load initial defaults from API.
  [ensureComputeFootprint]: (init_data, action)=>{
    console.log('ensureComputeFootprint - init_data', init_data);
    console.log('ensureComputeFootprint - defaults', action);
    return loop(
      null,
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(action.payload)
          .then((api_data) => {
            return computeFootprintRetrieved(api_data)
          })
          .then((api_data) => {
            return parseFootprintResult(api_data)
          })
          .catch((err) => {
            return computeFootprintRetrievalError(err)
          })
      })
    )
  },

  [computeFootprintRetrieved]: (_init_data, api_data)=>{
    // return Immutable.fromJS({average_footprint, api_data})
    // return loop(
    //     null,
    //     fromJS({average_footprint: api_data})
    // )
    console.log('computeFootprintRetrieved - api_data', api_data);
    return fromJS(api_data)
  },

  [computeFootprintRetrievalError]: (_init_data, _result)=>{
    // @ToDo: create error functions
    return fromJS({load_error: true});
  },

  [parseFootprintResult]: (_init_data, data)=>{
    let result = data.payload;
    console.log('result:', result);
    result = Object.keys(result).reduce((hash, api_key)=>{
      if (!/^(result|input)_takeaction/.test(api_key)){
        hash[api_key] = result[api_key]
      }
      return hash;
    }, {});
    console.log('parseFootprintResult - data', result);
    return fromJS(result)
  }


};

const REDUCER = createReducer(ACTIONS, 0);

export default REDUCER;
