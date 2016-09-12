import { fromJS } from 'immutable';
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
    let merged = state.get(payload.id).merge(payload.data).toJS();
    return fromJS({[payload.id]: merged})
  },

  [pushUIAlarm]: (state, payload)=>{
    console.log('UI setState state', state);
    console.log('UI setState payload', payload);
    return fromJS({alerts: payload})
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
