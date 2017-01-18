import { fromJS, Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import CalculatorApi from 'api/calculator.api';
import { updateAnswers } from 'api/user.api';
import { setLocalStorageItem, getLocalStorageItem, tokenIsValid } from 'shared/lib/utils/utils';
import { ensureFootprintComputed, footprintRetrieved, userFootprintError, parseFootprintResult, parseTakeactionResult, userFootprintUpdated, userFootprintReset, updatedFootprintComputed, updateTakeactionResult, updateRemoteUserAnswers, updateActionStatus } from './user_footprint.actions';

/*
  user_footprint: {
    data: <Object>,
    actions: <Object>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const ACTIONS = {

  // Load initial defaults from API.
  [ensureFootprintComputed]: (state, payload) => {
    const updated = state.set('data', payload)
                       .set('loading', true);

    return loop(
      updated,
      Effects.promise(() => CalculatorApi.computeFootprint(payload.toJS())
          .then(footprintRetrieved)
          .catch(userFootprintError)),
    );
  },

  [footprintRetrieved]: (state, api_data) => {
    const merged_data = state.get('data')
                           .merge(api_data);
    setLocalStorageItem('user_footprint', merged_data.toJS());

    const updated = state.set('data', merged_data);

    return loop(
      fromJS(updated),
      Effects.constant(parseFootprintResult(merged_data)),
    );
  },

  [userFootprintError]: (state) => {
    const updated = state.set('load_error', true)
                       .set('loading', false);

    return updated;
  },

  [parseFootprintResult]: (state, footprint_result) => {
    let result = footprint_result;
    if (state.has('result_takeaction_pounds')) {
      if (state.hasIn(['result_takeaction_pounds', 'more_efficient_vehicle'])) {
        if (Map.isMap(result)) result = result.toJS();
        const filtered = {};
        result = Object.keys(result).reduce((hash, api_key) => {
          if (!/^(result|input)_takeaction/.test(api_key)) {
            filtered[api_key] = result[api_key];
          }
          return filtered;
        }, {});

        const merged_data = state.get('data')
                               .merge(result);
        setLocalStorageItem('user_footprint', merged_data);

        const updated = state.set('data', merged_data)
                           .set('loading', false);

        return loop(
          fromJS(updated),
          Effects.constant(updateRemoteUserAnswers()),
        );
      }
    }

    const updated = state.set('data', state.get('data').merge(result));

    return loop(
      fromJS(updated),
      Effects.constant(parseTakeactionResult(result)),
    );
  },

  [parseTakeactionResult]: (state, footprint_result) => {
    let result = footprint_result;
    const merged = state.get('data')
                      .merge(result);

    if (!Map.isMap(result)) result = new Map(result);

    const updated = state.set('data', merged)
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
      Effects.constant(updateRemoteUserAnswers()),
    );
  },

  [userFootprintUpdated]: (state, api_data) => {
    const merged_data = state.get('data')
                           .merge(api_data);
    setLocalStorageItem('user_footprint', merged_data);

    const updated = state.set('data', merged_data)
                       .setIn(['data', 'input_changed'], 1)
                       .set('loading', false);

    return fromJS(updated);
  },

  [userFootprintReset]: (state) => {
    const reset = state.get('data').clear();
    setLocalStorageItem('user_footprint', reset);

    const updated = state.set('data', reset);

    return fromJS(updated);
  },

  [updatedFootprintComputed]: (state, payload) => {
    let params = payload;
    if (Map.isMap(payload)) params = payload.toJS();

    const merged_data = state.get('data')
                           .merge(payload);

    setLocalStorageItem('user_footprint', merged_data);

    const updated = state.set('data', merged_data);

    return loop(
      fromJS(updated),
      Effects.promise(() => CalculatorApi.computeFootprint(params)
          .then(parseFootprintResult)
          .catch(userFootprintError)),
    );
  },

  [updateTakeactionResult]: state => loop(
      state,
      Effects.promise(() => CalculatorApi.computeTakeactionResults(state.get('data').toJS())
          .then(parseTakeactionResult)
          .catch(userFootprintError)),
    ),

  [updateRemoteUserAnswers]: (state) => {
    const auth_status = getLocalStorageItem('auth');

    if ({}.hasOwnProperty.call(auth_status, 'token')) {
      if (tokenIsValid(auth_status.token)) {
        updateAnswers(state.get('data').toJS(), auth_status.token);
      }
    }
    return fromJS(state);
  },

  [updateActionStatus]: (state, params) => {

    let actions;
    let updated;

    console.log('updateActionStatus params', params);

    if (params.status === 'pledged') {

      const action_update = {
        [params.key]: params.details
      }
      actions = state.getIn(['actions', 'pledged'])
                     .merge(action_update);

      updated = state.setIn(['actions', 'pledged'], actions)
    } else if (params.status === 'unpledged' || params.status === 'not_relevant') {

      actions = state.get('actions');
      updated = state;

      if (actions.hasIn(['pledged', params.key])) {
        const cleared = actions.deleteIn(['pledged', params.key]);
        updated = state.set('actions', cleared)
      }

      if (params.status === 'not_relevant') {
        const not_relevant = actions.get('not_relevant');
        const pushed = not_relevant.push(params.key);
        updated = state.setIn(['actions', 'not_relevant'], pushed)
      }
    }

    console.log('updated actionstatus', updated.toJS());

    return fromJS(updated);

  },
};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
