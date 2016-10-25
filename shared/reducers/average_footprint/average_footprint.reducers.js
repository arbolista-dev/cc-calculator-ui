import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureDefaults, defaultsRetrieved, defaultsRetrievalError, averageFootprintResetRequested, averageFootprintUpdated } from './average_footprint.actions';
import { footprintRetrieved } from './../user_footprint/user_footprint.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';


/*
  average_footprint: {
    data: <Object>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const ACTIONS = {

  [ensureDefaults]: (state, default_inputs)=>{
    state = state.set('loading', true)
                 .set('reset', false);

    return loop(
      state,
      Effects.promise(()=>{
        return CalculatorApi.getDefaultsAndResults(default_inputs)
          .then(defaultsRetrieved)
          .catch(defaultsRetrievalError)
      })
    )
  },

  [defaultsRetrieved]: (state, api_data)=>{
    setLocalStorageItem('average_footprint', api_data);

    if (!api_data.failed) {
      state = state.set('data', state.get('data').merge(api_data))
                         .set('reset', false);

      return loop(
        state,
        Effects.promise(()=>{
          return CalculatorApi.computeFootprint(api_data)
            .then(averageFootprintUpdated)
            .catch(defaultsRetrievalError)
        })
      )
    } else {
      return Effects.constant(defaultsRetrievalError(api_data))
    }
  },

  [defaultsRetrievalError]: (state, _result)=>{
    state = state.set('load_error', true)
                 .set('loading', false);

    return state;
  },

  [averageFootprintUpdated]: (state, api_data)=>{
    let merged_data = state.get('data').merge(api_data);

    setLocalStorageItem('average_footprint', merged_data);

    let updated = state.set('data', merged_data)
                       .set('loading', false)
                       .set('reset', false);

    return loop(
      fromJS(updated),
      Effects.constant(footprintRetrieved(merged_data.toJS()))
    )
  },

  [averageFootprintResetRequested]: (state, _payload)=>{
    return state.set('reset', true);
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
