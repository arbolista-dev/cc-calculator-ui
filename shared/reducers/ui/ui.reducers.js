import { fromJS, Map, List } from 'immutable';
import { createReducer } from 'redux-act';

import { setLocalStorageItem } from 'shared/lib/utils/utils';
import { updateUI, pushAlert, resetAlerts } from './ui.actions';

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

  [updateUI]: (state, payload) => {
    let updated;
    if (state.has(payload.id)) {
      if (Map.isMap(state.get(payload.id))) {
        updated = fromJS(state.set(payload.id, state.get(payload.id).merge(payload.data)));
      } else {
        updated = fromJS(state.set(payload.id, payload.data));
      }
    } else {
      updated = fromJS(state.set(payload.id, payload.data));
    }
    setLocalStorageItem('ui', updated.toJS());
    return updated;
  },

  [pushAlert]: (state, payload) => {
    const updated = state.setIn(['alerts', payload.id], new List(payload.data))
                         .set('alert_exists', true);
    return updated;
  },

  [resetAlerts]: (state) => {
    let updated = state;
    Object.keys(state.get('alerts').toJS()).forEach((type) => {
      updated = state.setIn(['alerts', type], new List());
    });
    updated = updated.set('alert_exists', false);
    return updated;
  },

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
