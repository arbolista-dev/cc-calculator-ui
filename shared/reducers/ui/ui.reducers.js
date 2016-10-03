import { fromJS, Map, List } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { updateUI, pushAlert, resetAlerts } from './ui.actions'
/*
  ui: {
    alerts: <Map>,
    leaders_chart: <Map>,
    display_location: <String>,
    external_offset: <Map>,
    connect_to_api: <Boolean>
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
    let data = payload.data;

    if (!List.isList(data)) data = new List(data);
    let updated = state.setIn(['alerts', payload.id], data)
    return fromJS(updated)
  },

  [resetAlerts]: (state, _payload)=>{

    let updated;
    let alerts = state.get('alerts');
    Object.keys(alerts.toJS()).forEach((type) => {
      if (alerts.get(type).length !== 0) {
        updated = state.setIn(['alerts', type], new List())
      } else {
        updated = state.setIn(['alerts', type], alerts.get(type))
      }
    })

    return fromJS(updated)
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
