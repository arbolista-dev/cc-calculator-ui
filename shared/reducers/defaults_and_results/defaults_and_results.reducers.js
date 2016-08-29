import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureDefaults, defaultsRetrieved, defaultsRetrievalError } from './defaults_and_results.actions';
import { ensureComputeFootprint } from './../compute_footprint/compute_footprint.actions';

// export function getDefaultsAndResults(default_inputs) {
//   return CalculatorApi.getDefaultsAndResults(default_inputs)
//     .then((api_data) => {
//       return defaultsRetrieved(api_data)
//     })
//     .then((api_data) => {
//       return ensureComputeFootprint(api_data)
//     })
//     .catch((err) => {
//       return defaultsRetrievalError(err)
//     })
// }


const ACTIONS = {

  [ensureDefaults]: (default_data, default_inputs)=>{
    console.log('ensureDefaults default_data', default_data);
    console.log('ensureDefaults default_inputs', default_inputs);
    return loop(
      null,
      Effects.promise(()=>{
        return CalculatorApi.getDefaultsAndResults(default_inputs)
          .then(defaultsRetrieved)
          .then(ensureComputeFootprint)
          .catch(defaultsRetrievalError)
      })
    )
  },

  // Load initial defaults from API.
  // [ensureDefaults]: (default_data, default_inputs)=>{
  //   console.log('ensureDefaults');
  //   console.log('- ensureDefaults default_data', default_data);
  //   return loop(
  //     null,
  //     Effects.promise(getDefaultsAndResults(default_inputs))
  //   )
  // },

  // [defaultsRetrieved]: (_defaults_data, api_data)=>{
  //   console.log('defaultsRetrieved');
  //   console.log('- api_data', api_data);
  //   return loop(
  //     fromJS({average_footprint: api_data}),
  //     Effects.constant(ensureComputeFootprint)
  //   )
  // },

  [defaultsRetrieved]: (_defaults_data, api_data)=>{
    console.log('defaultsRetrieved - api_data', api_data);
    return fromJS({average_footprint: api_data})
  },

  [defaultsRetrievalError]: (_defaults_data, _result)=>{
    // @ToDo: create error functions
    console.log('defaultsRetrievalError - _result', _result);
    return fromJS({load_error: true});
  }


};

const REDUCER = createReducer(ACTIONS, 0);

export default REDUCER;
