import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureComputeFootprint, computeFootprintRetrieved, computeFootprintRetrievalError, parseFootprintResult, userFootprintUpdated } from './compute_footprint.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';


/*
  user_footprint: {
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

    // does data passed from average_footprint need to be merged into data?!
    // fromJS({data: payload, loading: true}),
    return loop(
      fromJS({loading: true}),
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

    // let merged_data = state.get('data').merge(api_data);
    // console.log('computeFootprintRetrieved - merged data: ', merged_data.toJS());

    setLocalStorageItem('user_footprint', api_data);


    if (!state.data) {
      // user_footprint has not been set
      console.log('- User footprint has not been set!');
      return loop(
        fromJS({data: api_data, loading: false}),
        Effects.constant(parseFootprintResult(api_data))
      )
    } else {

    }

  },

  [computeFootprintRetrievalError]: (_state, _result)=>{
    return fromJS({load_error: true, loading: false});
  },

  [parseFootprintResult]: (state, result)=>{
    result = Object.keys(result).reduce((hash, api_key)=>{
      if (!/^(result|input)_takeaction/.test(api_key)){
        hash[api_key] = result[api_key]
      }
      return hash;
    }, {});

    let merged_data = state.get('data').merge(result);
    console.log('parseFootprintResult - result data', merged_data);

    setLocalStorageItem('user_footprint', merged_data);
    return fromJS({data: merged_data, loading: false})
  },

  [userFootprintUpdated]: (state, api_data)=>{
    let merged_data = state.get('data').merge(api_data);

    console.log('userFootprintUpdated: ', merged_data);
    setLocalStorageItem('user_footprint', merged_data);

    return fromJS({data: merged_data, loading: false})
  }


};

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
