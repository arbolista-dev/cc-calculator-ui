import { fromJS, Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { ensureUserFootprintComputed, ensureUserFootprintRetrieved, ensureUserFootprintError, parseFootprintResult, parseTakeactionResult, userFootprintUpdated, userFootprintReset, updatedFootprintComputed, updateTakeactionResults } from './user_footprint.actions';
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
    // console.log('ensureUserFootprintComputed - state', state);
    // console.log('ensureUserFootprintComputed - payload', payload);

    // does data passed from average_footprint need to be merged into data?!
    // fromJS({data: payload, loading: true}),
    let updated = state.set('data', payload)
                       .set('loading', true);

    return loop(
      fromJS(updated),
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(payload.toJS())
          .then(ensureUserFootprintRetrieved)
          .catch(ensureUserFootprintError)
      })
    )
  },

  [ensureUserFootprintRetrieved]: (state, api_data)=>{
    // console.log('ensureUserFootprintRetrieved - state', state);
    // console.log('ensureUserFootprintRetrieved - api_data', api_data);

    let merged_data = state.get('data')
                           .merge(api_data);
    setLocalStorageItem('user_footprint', merged_data.toJS());

    if (state.get('data').isEmpty() || state.getIn(['data', 'input_changed']) != 1) {
      // @ToDo: Make sure this decision is made correctly
      // used to be -> if (!state_manager.user_footprint_set || state_manager.footprint_not_updated)

      let updated = state.set('data', merged_data);
      return loop(
        fromJS(updated),
        Effects.constant(parseFootprintResult(merged_data))
      )
    } else {
      let updated = state.set('data', merged_data)
                         .set('loading', false)

      return loop(
        fromJS(updated),
        Effects.constant(parseFootprintResult(merged_data))
      )
    }
  },

  [ensureUserFootprintError]: (state, _result)=>{
    console.log('ensureUserFootprintError');

    let updated = state.set('load_error', true)
                       .set('loading', false);

    return fromJS(updated);

  },

  [parseFootprintResult]: (state, result)=>{
    // console.log('parseFootprintResult state', state);
    // console.log('parseFootprintResult result', result);

    if (state.has('result_takeaction_pounds')) {
      if (fromJS(state.get('result_takeaction_pounds')).has('more_efficient_vehicle')) {
        if(Map.isMap(result)) result = result.toJS();

        result = Object.keys(result).reduce((hash, api_key)=>{
          if (!/^(result|input)_takeaction/.test(api_key)){
            hash[api_key] = result[api_key]
          }
          return hash;
        }, {});

        let merged_data = state.get('data')
                                   .merge(result);
        setLocalStorageItem('user_footprint', merged_data);

        let updated = state.set('data', merged_data)
                               .set('loading', false);

        return fromJS(updated);
            // @ToDo: Check if authenticated -> updateUserAnswers
      }
    }

    let merged = state.get('data')
                      .merge(result);

    let updated = state.set('data', merged);

    return loop(
      fromJS(updated),
      Effects.constant(parseTakeactionResult(result))
    )
    // @ToDo: Check if authenticated -> updateUserAnswers

  },

  [parseTakeactionResult]: (state, result)=>{

    let merged = state.get('data')
                       .merge(result);

    if(!Map.isMap(result)) result = new Map(result);

    let updated = state.set('data', merged)
                       .set('result_takeaction_pounds', JSON.parse(result.get('result_takeaction_pounds')))
                       .set('result_takeaction_dollars', JSON.parse(result.get('result_takeaction_dollars')))
                       .set('result_takeaction_net10yr', JSON.parse(result.get('result_takeaction_net10yr')))
                       .set('loading', false);

    setLocalStorageItem('result_takeaction_pounds', result.get('result_takeaction_pounds'));
    setLocalStorageItem('result_takeaction_dollars', result.get('result_takeaction_dollars'));
    setLocalStorageItem('result_takeaction_net10yr', result.get('result_takeaction_net10yr'));
    setLocalStorageItem('user_footprint', merged);

    return fromJS(updated);
  },

  [userFootprintUpdated]: (state, api_data)=>{

    let merged_data = state.get('data')
                           .merge(api_data);
    setLocalStorageItem('user_footprint', merged_data);

    let updated = state.set('data', merged_data)
                       .setIn(['data', 'input_changed'], 1)
                       .set('loading', false);

    return fromJS(updated);
  },

  [userFootprintReset]: (state, _payload)=>{

    let reset = state.get('data').clear();
    setLocalStorageItem('user_footprint', reset);

    let updated = state.set('data', reset);

    console.log('userFootprintReset cleared ', updated);
    return fromJS(updated);
  },

  [updatedFootprintComputed]: (state, payload)=>{
    console.log('updatedFootprintComputed payload', payload);
    let params = payload;
    if(Map.isMap(payload)) params = payload.toJS();

    return loop(
      fromJS(state),
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(params)
          .then(parseFootprintResult)
          .catch(ensureUserFootprintError)
      })
    )
  },

  [updateTakeactionResults]: (state)=>{
    let action_inputs = state.get('data');

    return loop(
      state,
      Effects.promise(()=>{
        return CalculatorApi.computeTakeactionResults(action_inputs.toJS())
          .then(parseTakeactionResult)
          .catch(ensureUserFootprintError)
      })
    )

  }
};

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
