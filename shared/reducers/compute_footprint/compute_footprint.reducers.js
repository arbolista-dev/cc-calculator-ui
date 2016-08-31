import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureComputeFootprint, computeFootprintRetrieved, computeFootprintRetrievalError, parseFootprintResult } from './compute_footprint.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';


/*
{
  data: <Object>,

  loading: <Boolean>,
  load_error: <Boolean>
}
*/

const DEFAULT_STATE = {
  data: undefined,
  loading: false,
  load_error: false
}

const ACTIONS = {

  // Load initial defaults from API.
  [ensureComputeFootprint]: (state, payload)=>{
    console.log('ensureComputeFootprint - state', state);
    console.log('ensureComputeFootprint - payload', payload);
    return loop(
      fromJS({data: payload, loading: true}),
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(payload)
          .then(computeFootprintRetrieved)
          .catch(computeFootprintRetrievalError)
      })
    )
  },

  [computeFootprintRetrieved]: (state, api_data)=>{
    console.log('computeFootprintRetrieved - state', state.toJS());
    console.log('computeFootprintRetrieved - api_data', api_data);

    let merged_data = state.get('data').merge(api_data).toJS();
    setLocalStorageItem('user_footprint', merged_data);
    console.log('computeFootprintRetrieved - merged data: ', merged_data);
    return fromJS({data: merged_data, loading: false})
  },

  [computeFootprintRetrievalError]: (_init_data, _result)=>{
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

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
