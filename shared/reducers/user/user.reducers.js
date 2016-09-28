import { fromJS, Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { addUser, loginUser, logoutUser, forgotPassword } from 'api/user.api';
import { signup, login, loggedIn, logout, loggedOut, authError } from './user.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';

/*{
    auth: {
      token: <String>,
      name: <String>,
      loading: <Boolean>,
      response: <Boolean>,
      response_msg: <Object>
    }
  } */

const DEFAULT_STATE = {
  data: {
    token: undefined,
    name: undefined,
    answers: undefined
  },
  loading: false,
  load_error: false,
  received: false,
  success: undefined,
  error_msg: undefined
};

const ACTIONS = {

  [signup]: (state, params)=>{
    console.log('signup state', state);
    console.log('signup params', params);
    // let cleared = state.get('data').clear()

    let updated = state.set('loading', true)

    return loop(
      fromJS(updated),
      Effects.promise(()=>{
        return addUser(params)
          .then(loggedIn)
          .catch(authError)
      })
    )

  },

  [login]: (state, params)=>{
    
    return loop(
      state.set('loading', true),
      Effects.promise(()=>{
        return loginUser(params)
          .then(loggedIn)
          .catch(authError)
      })
    )
  },

  [loggedIn]: (state, api_response)=>{
    console.log('loggedIn state', state);
    console.log('loggedIn response', api_response);
    if (api_response.success) {
      let auth = {
          token: api_response.data.token,
          name: api_response.data.name
        },
        remote_anwers = JSON.parse(api_response.data.answers),
        res = {
          received: true,
          success: true,
        };

      setLocalStorageItem('auth', auth);
      if (remote_anwers.length !== 0) {
        console.log('remote answers available -> set user_footprint');
        // @ToDo: setUserFootprint to answers!
        // login.state_manager.setUserFootprint(remote_anwers);
      }

      let updated = state.setIn(['data', 'token'], auth.token)
                         .setIn(['data', 'name'], auth.name)
                         .set('loading', false)
                         .set('received', true)
                         .set('success', true)

      console.log('loggedIn success updated state', updated);

      return fromJS(updated)

    } else {
      let err = JSON.parse(api_response.error);

      let updated = state.set('loading', false)
                         .set('received', true)
                         .set('success', false)
                         .set('error_msg', err);

      console.log('loggedIn error updated state', updated.toJS());
      return fromJS(updated)
    }

  },

  [logout]: (current_session)=>{

  },

  [loggedOut]: (_current_session, _res)=>{

  },

  [authError]: (_current_session, _res)=>{

  }

};

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
