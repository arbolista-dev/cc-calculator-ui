import { fromJS, Map, List } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { updateUI, pushAlert, resetAlerts } from './ui.actions'
/*
  ui: {
    alert_exists: <Boolean>
    alerts: <Map>,
    leaders_chart: <Map>,
    display_location: <String>,
    external_offset: <Map>,
    connect_to_api: <Boolean>,
    vehicles: <Map>
  }
*/

const ACTIONS = {

  [updateUI]: (state, payload)=>{
    if (state.has(payload.id)) {
      let merged;
      if (Map.isMap(state.get(payload.id))) {
        merged = state.get(payload.id).merge(payload.data);
      } else {
        merged = payload.data;
      }

      let updated = state.set(payload.id, merged);
      return fromJS(updated);

    } else {
      let updated = state.set(payload.id, payload.data);
      return fromJS(updated);
    }
  },

  [pushAlert]: (state, payload)=>{
    let new_list = new List(payload.data);
    let updated = state.setIn(['alerts', payload.id], new_list)
                       .set('alert_exists', true);

    return fromJS(updated)
  },

  [resetAlerts]: (state, _payload)=>{
    let updated = state,
    alerts = state.get('alerts');

    Object.keys(alerts.toJS()).forEach((type) => {
        updated = updated.setIn(['alerts', type], new List())
    })
    updated = updated.set('alert_exists', false);

    return fromJS(updated)
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
