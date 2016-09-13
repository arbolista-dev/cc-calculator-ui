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
    // return fromJS(state.set([payload.id], merged))
    // try Object.assign({}, state, {[payload.id]: merged})
    console.log('UI updated state', Object.assign({}, state.get(), {[payload.id]: merged}));
    return fromJS(Object.assign({}, state, {[payload.id]: merged}))
    // return fromJS({[payload.id]: merged})
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
