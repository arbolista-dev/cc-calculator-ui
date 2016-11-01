import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';
import { retrieveProfile, profileRetrieved, apiError } from './profile.actions';

import { showProfile } from 'api/user.api';

/*
  profile: {
    data: <Map>,
    loading: <Boolean>,
    load_error: <Boolean>
  }
*/

const ACTIONS = {

  [retrieveProfile]: (current_profile, payload)=>{
    // if (!current_profile || (current_profile.hasIn(['data', 'user_id']) && current_profile.getIn(['data', 'user_id']) !== payload.user_id)){
      return loop(
        fromJS({loading: true}),
        Effects.promise(()=>{
          return showProfile(payload.user_id)
            .then(profileRetrieved)
            .catch(apiError)
        })
      )
    // }
  },

  [profileRetrieved]: (state, api_data)=>{
    if (api_data.success) {
      let data = state.set('data', fromJS(api_data.data))
                      .set('loading', false);
      return fromJS(data);
    } else {
      return Effects.constant(apiError)
    }

  },

  [apiError]: (_state, _res)=>{
    return fromJS({load_error: true});
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
