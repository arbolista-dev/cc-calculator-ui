import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureComputeFootprint, computeFootprintRetrieved, computeFootprintRetrievalError, parseFootprintResult, userFootprintUpdated, userLocationUpdated } from './compute_footprint.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';


/*
  user_footprint: {
    user_location: <String>,
    data: <Object>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const DEFAULT_STATE = {
  user_location: undefined,
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

    let merged_data = state.get('data').merge(api_data);
    console.log('computeFootprintRetrieved - merged data: ', merged_data.toJS());
    setLocalStorageItem('user_footprint', merged_data);


    if (!state.data) {
      // user_footprint has not been set
      console.log('- User footprint has not been set!');
      return loop(
        fromJS({data: merged_data, loading: false}),
        Effects.constant(parseFootprintResult(merged_data))
      )
    } else {
      return fromJS({data: merged_data, loading: false})
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
  },

  [userLocationUpdated]: (state, data)=>{
    console.log('userLocationUpdated - state', state.toJS());
    console.log('userLocationUpdated - api_data', data);

    return fromJS({user_location: data})
  }


};

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
