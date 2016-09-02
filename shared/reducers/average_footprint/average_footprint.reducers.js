import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureDefaults, defaultsRetrieved, defaultsRetrievalError, averageFootprintUpdated } from './average_footprint.actions';
import { ensureComputeFootprint } from './../compute_footprint/compute_footprint.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';


/*
  average_footprint: {
    data: <Object>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const DEFAULT_STATE = {
  data: {},
  loading: false,
  load_error: false
}

const ACTIONS = {

  [ensureDefaults]: (state, default_inputs)=>{
    console.log('ensureDefaults - state', state.toJS());
    console.log('ensureDefaults - default_inputs', default_inputs);
    return loop(
      fromJS({loading: true}),
      Effects.promise(()=>{
        return CalculatorApi.getDefaultsAndResults(default_inputs)
          .then(defaultsRetrieved)
          .catch(defaultsRetrievalError)
      })
    )
  },

  [defaultsRetrieved]: (_defaults_data, api_data)=>{
    console.log('defaultsRetrieved - data: ', api_data);
    setLocalStorageItem('average_footprint', api_data);

    // implications for not setting loading to false?
    // is ensureDefaults called without afterwards updating user_footprint ?
    return loop(
      fromJS({data: api_data}),
      Effects.constant(ensureComputeFootprint(api_data))
    )
  },

  [defaultsRetrievalError]: (_defaults_data, result)=>{
    console.log('defaultsRetrievalError - _result', result);
    return fromJS({load_error: true, loading: false});
  },

  [averageFootprintUpdated]: (state, api_data)=>{
    let merged_data = state.get('data').merge(api_data);

    console.log('averageFootprintUpdated: ', merged_data);
    setLocalStorageItem('average_footprint', merged_data);

    return fromJS({data: merged_data, loading: false})
  }

};

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
