import { fromJS, Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { updateUI, pushAlert } from './ui.actions'

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

    let updated;
    if (payload.reset) {
      let cleared = state.getIn(['alerts', payload.id]).clear();
      updated = state.setIn(['alerts', payload.id], cleared);
    } else {
      let pushed = state.getIn(['alerts', payload.id]).push(payload.data);
      updated = state.setIn(['alerts', payload.id], pushed);
    }
    return fromJS(updated);
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
