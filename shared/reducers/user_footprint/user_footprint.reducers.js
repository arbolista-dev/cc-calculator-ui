import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureUserFootprintComputed, ensureUserFootprintRetrieved, ensureUserFootprintError, parseFootprintResult, userFootprintUpdated } from './user_footprint.actions';
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
  [ensureUserFootprintComputed]: (state, payload)=>{
    console.log('ensureUserFootprintComputed - state', state);
    console.log('ensureUserFootprintComputed - payload', payload);

    // does data passed from average_footprint need to be merged into data?!
    // fromJS({data: payload, loading: true}),
    return loop(
      fromJS({data: payload, loading: true}),
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(payload)
          .then(ensureUserFootprintRetrieved)
          .catch(ensureUserFootprintError)
      })
    )
  },

  [ensureUserFootprintRetrieved]: (state, api_data)=>{
    console.log('ensureUserFootprintRetrieved - state', state);
    console.log('ensureUserFootprintRetrieved - api_data', api_data);

    let merged_data = state.get('data')
                           .merge(api_data);
    setLocalStorageItem('user_footprint', merged_data);

    console.log('ensureUserFootprintRetrieved - merged data: ',  merged_data);

    if (!state.get('data').toJS()) {
      console.log('User footprint has not been set!');

      return loop(
        fromJS({data: merged_data, loading: false}),
        Effects.constant(parseFootprintResult(merged_data))
      )
    } else {
      return fromJS({data: merged_data, loading: false})
    }
  },

  [ensureUserFootprintError]: (state, _result)=>{

    let updated = state.set('load_error', true)
                       .set('loading', false);
    return fromJS(updated);

  },

  [parseFootprintResult]: (state, result)=>{
    result = Object.keys(result).reduce((hash, api_key)=>{
      if (!/^(result|input)_takeaction/.test(api_key)){
        hash[api_key] = result[api_key]
      }
      return hash;
    }, {});

    let merged_data = state.get('data')
                           .merge(result);
    setLocalStorageItem('user_footprint', merged_data);

    console.log('parseFootprintResult - result data', merged_data);
    return fromJS({data: merged_data, loading: false})
  },

  [userFootprintUpdated]: (state, api_data)=>{

    let merged_data = state.get('data')
                           .merge(api_data);
    setLocalStorageItem('user_footprint', merged_data);

    console.log('userFootprintUpdated state', state);
    console.log('userFootprintUpdated api_data', api_data);
    console.log('userFootprintUpdated: ', merged_data);

    return fromJS({data: merged_data, loading: false})
  }

};

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
