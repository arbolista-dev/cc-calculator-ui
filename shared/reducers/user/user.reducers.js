import { fromJS, Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { addUser, loginUser, logoutUser, forgotPassword } from 'api/user.api';
import { signup, login, loggedIn, signedUp, logout, loggedOut, authError } from './user.actions';
import { pushAlert } from '../ui/ui.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';

/*{
    auth: {
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
    return loop(
      state.set('loading', true),
      Effects.promise(()=>{
        return addUser(params)
          .then(signedUp)
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
                         .set('success', true);

      let alert = {
        id: 'shared',
        data: [{
          route: 'Settings',
          needs_i18n: true,
          type: 'success',
          message: 'success.login'
        }]
      };

      return loop(
        fromJS(updated),
        Effects.constant(pushAlert(alert))
      )

    } else {
      let err = JSON.parse(api_response.error);

      let updated = state.set('loading', false)
                         .set('received', true)
                         .set('success', false)
                         .set('error_msg', err);

     let alert = {
       id: 'login',
       data: [{
         route: 'Settings',
         needs_i18n: true,
         type: 'danger',
         message: 'errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0]
       }]
     };

     return loop(
       fromJS(updated),
       Effects.constant(pushAlert(alert))
     )
    }

  },

  [signedUp]: (state, api_response)=>{
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

      console.log('remote_anwers', remote_anwers);

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
                         .set('success', true);

      let alert = {
        id: 'shared',
        data: [{
          route: 'Settings',
          needs_i18n: true,
          type: 'success',
          message: 'success.sign_up'
        }]
      };

      return loop(
        fromJS(updated),
        Effects.constant(pushAlert(alert))
      )

    } else {
      let err = JSON.parse(api_response.error);

      let updated = state.set('loading', false)
                         .set('received', true)
                         .set('success', false)
                         .set('error_msg', err);

     let alert = {
       id: 'sign_up',
       data: [{
         route: 'Settings',
         needs_i18n: true,
         type: 'danger',
         message: 'errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0]
       }]
     };

     return loop(
       fromJS(updated),
       Effects.constant(pushAlert(alert))
     )
    }

  },

  [logout]: (state)=>{
    return loop(
      state.set('loading', true),
      Effects.promise(()=>{
        return logoutUser(state.getIn(['data', 'token']))
          .then(loggedOut)
          .catch(authError)
      })
    )
  },

  [loggedOut]: (state, api_response)=>{
    if (api_response.success) {

      localStorage.removeItem('auth');

      let updated = state.deleteIn(['data', 'token'])
                         .deleteIn(['data', 'name'])
                         .set('loading', false)
                         .set('received', true)
                         .set('success', true);
      let alert = {
        id: 'shared',
        data: [{
          route: 'Settings',
          needs_i18n: true,
          type: 'success',
          message: 'success.logout'
        }]
      };

      return loop(
        fromJS(updated),
        Effects.constant(pushAlert(alert))
      )

    }
  },

  [authError]: (state, action)=>{
    console.log('authError state', state);
    console.log('authError action', action);
  }

};

const REDUCER = createReducer(ACTIONS, DEFAULT_STATE);

export default REDUCER;
