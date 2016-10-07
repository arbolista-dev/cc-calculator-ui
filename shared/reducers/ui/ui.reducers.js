import { fromJS, Map, List } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { updateUI, pushAlert, resetAlerts } from './ui.actions'
/*
  ui: {
    external_offset: <Map>,
    alerts: <Map>,
    leaders_chart: <Map>,
    display_location: <String>,
    alert_exists: <Boolean>
    connect_to_api: <Boolean>,
    vehicles: <Map>
  }
*/

const ACTIONS = {

  [updateUI]: (state, payload)=>{
    if (state.has(payload.id)) {
      if (Map.isMap(state.get(payload.id))) {
        return fromJS(state.set(payload.id, state.get(payload.id).merge(payload.data)));
      } else {
        return fromJS(state.set(payload.id, payload.data));
      }
    } else {
      return fromJS(state.set(payload.id, payload.data));
    }
  },

  [pushAlert]: (state, payload)=>{
    state = state.setIn(['alerts', payload.id], new List(payload.data))
                 .set('alert_exists', true);

    return state
  },

  [resetAlerts]: (state, _payload)=>{
    Object.keys(state.get('alerts').toJS()).forEach((type) => {
        state = state.setIn(['alerts', type], new List())
    })
    state = state.set('alert_exists', false);

    return state
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
