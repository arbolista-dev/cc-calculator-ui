import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { setLocalStorageItem } from 'shared/lib/utils/utils';
import { ensureDefaults, defaultsRetrieved, defaultsRetrievalError, averageFootprintResetRequested, averageFootprintUpdated } from './average_footprint.actions';
import { footprintRetrieved } from './../user_footprint/user_footprint.actions';


/*
  average_footprint: {
    data: <Object>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const ACTIONS = {

  [ensureDefaults]: (state, default_inputs) => {
    const updated = state.set('loading', true)
                         .set('reset', false);

    return loop(
      updated,
      Effects.promise(() => CalculatorApi.getDefaultsAndResults(default_inputs)
          .then(defaultsRetrieved)
          .catch(defaultsRetrievalError)),
    );
  },

  [defaultsRetrieved]: (state, api_data) => {
    setLocalStorageItem('average_footprint', api_data);

    if (!api_data.failed) {
      const updated = state.set('data', state.get('data').merge(api_data))
                         .set('reset', false);

      return loop(
        updated,
        Effects.promise(() => CalculatorApi.computeFootprint(api_data)
            .then(averageFootprintUpdated)
            .catch(defaultsRetrievalError)),
      );
    }
    return Effects.constant(defaultsRetrievalError(api_data));
  },

  [defaultsRetrievalError]: (state) => {
    const updated = state.set('load_error', true)
                         .set('loading', false);

    return updated;
  },

  [averageFootprintUpdated]: (state, api_data) => {
    const merged_data = state.get('data').merge(api_data);

    setLocalStorageItem('average_footprint', merged_data);

    const updated = state.set('data', merged_data)
                       .set('loading', false)
                       .set('reset', false);

    return loop(
      fromJS(updated),
      Effects.constant(footprintRetrieved(merged_data.toJS())),
    );
  },

  [averageFootprintResetRequested]: state => state.set('reset', true),

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
