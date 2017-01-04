import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { showProfile } from 'api/user.api';
import { retrieveProfile, profileRetrieved, apiError } from './profile.actions';
import { pushAlert } from '../ui/ui.actions';

/*
  profile: {
    data: <Map>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const ACTIONS = {

  [retrieveProfile]: (current_profile, payload) => loop(
      fromJS({ loading: true }),
      Effects.promise(() => showProfile(payload.user_id, payload.token)
          .then(profileRetrieved)
          .catch(apiError)),
    ),

  [profileRetrieved]: (state, api_data) => {
    if (api_data.success) {
      const data = state.set('data', fromJS(api_data.data))
                        .set('loading', false);
      return fromJS(data);
    }
    const err = JSON.parse(api_data.error);
    const alert = {
      id: 'shared',
      data: [{
        needs_i18n: true,
        type: 'danger',
        message: `errors.${Object.keys(err)[0]}.${Object.values(err)[0]}`,
      }],
    };

    return loop(
      fromJS({ load_error: true, loading: false }),
      Effects.constant(pushAlert(alert)),
    );
  },

  [apiError]: () => fromJS({ load_error: true, loading: false }),

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
