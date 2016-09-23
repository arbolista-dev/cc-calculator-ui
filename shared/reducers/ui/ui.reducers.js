import { fromJS, Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { setUIState, pushUIAlarm } from './ui.actions'

/*
  ui: {
    <id>:{
      <key>: <String>
    }
  }
*/

const ACTIONS = {

  // Load initial defaults from API.
  [setUIState]: (state, payload)=>{
    console.log('UI setState state', state);
    console.log('UI setState payload', payload);

    if (state.has(payload.id)) {
      let merged;
      
      if (Map.isMap(state.get(payload.id))) {
        merged = state.get(payload.id).merge(payload.data);
      } else {
        merged = payload.data;
      }

      let updated = state.set(payload.id, merged)
      console.log('UI updated state', updated);
      return fromJS(updated)
    } else {
      console.log('UI state does not have property yet: ', payload.id);
      let updated = state.set(payload.id, payload.data);
      console.log('UI updated state with new property ',updated);
      return fromJS(updated);
    }
  },

  [pushUIAlarm]: (state, payload)=>{
    console.log('UI pushUIAlarm state', state.toJS());
    console.log('UI pushUIAlarm payload', payload);

    console.log('pushUIAlarm update', state.setIn(['alerts', payload.id], (l) => l.push(payload.data)));
    // return fromJS({alerts: payload})
    return state
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
