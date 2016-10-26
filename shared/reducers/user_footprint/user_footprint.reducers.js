import { fromJS, Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { updateAnswers } from 'api/user.api';
import { ensureFootprintComputed, footprintRetrieved, userFootprintError, parseFootprintResult, parseTakeactionResult, userFootprintUpdated, userFootprintReset, updatedFootprintComputed, updateTakeactionResult, updateRemoteUserAnswers } from './user_footprint.actions';
import { setLocalStorageItem, getLocalStorageItem, tokenIsValid } from 'shared/lib/utils/utils';


/*
  user_footprint: {
    data: <Object>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const ACTIONS = {

  // Load initial defaults from API.
  [ensureFootprintComputed]: (state, payload)=>{
    let updated = state.set('data', payload)
                       .set('loading', true);

    return loop(
      updated,
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(payload.toJS())
          .then(footprintRetrieved)
          .catch(userFootprintError)
      })
    )
  },

  [footprintRetrieved]: (state, api_data)=>{
    let merged_data = state.get('data')
                           .merge(api_data);
    setLocalStorageItem('user_footprint', merged_data.toJS());

    let updated = state.set('data', merged_data)

    return loop(
      fromJS(updated),
      Effects.constant(parseFootprintResult(merged_data))
    )

  },

  [userFootprintError]: (state, _result)=>{
    let updated = state.set('load_error', true)
                       .set('loading', false);

    return updated;

  },

  [parseFootprintResult]: (state, result)=>{

    if (state.has('result_takeaction_pounds')) {
      if (state.hasIn(['result_takeaction_pounds', 'more_efficient_vehicle'])) {
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

        return loop(
          fromJS(updated),
          Effects.constant(updateRemoteUserAnswers())
        );
      }
    }

    state = state.set('data', state.get('data').merge(result));

    return loop(
      fromJS(state),
      Effects.constant(parseTakeactionResult(result))
    );

  },

  [parseTakeactionResult]: (state, result)=>{

    let merged = state.get('data')
                      .merge(result);

    if(!Map.isMap(result)) result = new Map(result);

    let updated = state.set('data', merged)
                       .set('result_takeaction_pounds', fromJS(JSON.parse(result.get('result_takeaction_pounds'))))
                       .set('result_takeaction_dollars', fromJS(JSON.parse(result.get('result_takeaction_dollars'))))
                       .set('result_takeaction_net10yr', fromJS(JSON.parse(result.get('result_takeaction_net10yr'))))
                       .set('loading', false);

    setLocalStorageItem('result_takeaction_pounds', fromJS(result.get('result_takeaction_pounds')));
    setLocalStorageItem('result_takeaction_dollars', fromJS(result.get('result_takeaction_dollars')));
    setLocalStorageItem('result_takeaction_net10yr', fromJS(result.get('result_takeaction_net10yr')));
    setLocalStorageItem('user_footprint', merged);

    return loop(
      fromJS(updated),
      Effects.constant(updateRemoteUserAnswers())
    );
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

    return fromJS(updated);
  },

  [updatedFootprintComputed]: (state, payload)=>{
    let params = payload;
    if(Map.isMap(payload)) params = payload.toJS();

    let merged_data = state.get('data')
                           .merge(payload);

    setLocalStorageItem('user_footprint', merged_data);

    let updated = state.set('data', merged_data);

    return loop(
      fromJS(updated),
      Effects.promise(()=>{
        return CalculatorApi.computeFootprint(params)
          .then(parseFootprintResult)
          .catch(userFootprintError)
      })
    )
  },

  [updateTakeactionResult]: (state)=>{

    return loop(
      state,
      Effects.promise(()=>{
        return CalculatorApi.computeTakeactionResults(state.get('data').toJS())
          .then(parseTakeactionResult)
          .catch(userFootprintError)
      })
    )

  },

  [updateRemoteUserAnswers]: (state)=>{
    let auth_status = getLocalStorageItem('auth');

    if (auth_status.hasOwnProperty('token')) {
      if (tokenIsValid(auth_status.token)) {
        updateAnswers(state.get('data').toJS(), auth_status.token)
      }
    }
    return fromJS(state);
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
