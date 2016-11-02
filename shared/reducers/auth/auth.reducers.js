/*global localStorage*/

import { fromJS } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { addUser, loginUser, loginUserFacebook, logoutUser, forgotPassword } from 'api/user.api';
import { signup, login, loginFacebook, loggedIn, signedUp, logout, loggedOut, requestNewPassword, newPasswordRequested, authError } from './auth.actions';
import { updatedFootprintComputed } from '../user_footprint/user_footprint.actions';
import { averageFootprintResetRequested } from '../average_footprint/average_footprint.actions';
import { pushAlert } from '../ui/ui.actions';
import { setLocalStorageItem } from 'shared/lib/utils/utils';

/*{
    auth: {
      data: {
        token: undefined,
        name: undefined,
        answers: undefined,
        user_id: undefined
      },
      loading: false,
      load_error: false,
      received: false,
      success: undefined
    }
  } */

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

  [loginFacebook]: (state, params)=>{
    return loop(
      state.set('loading', true),
      Effects.promise(()=>{
        return loginUserFacebook(params)
          .then(loggedIn)
          .catch(authError)
      })
    )
  },

  [loggedIn]: (state, api_response)=>{
    if (api_response.success) {
      let auth = {
            token: api_response.data.token,
            name: api_response.data.name,
            user_id: api_response.data.user_id
          },
          remote_answers = JSON.parse(api_response.data.answers);

      setLocalStorageItem('auth', auth);

      let updated = state.setIn(['data', 'token'], auth.token)
                         .setIn(['data', 'name'], auth.name)
                         .setIn(['data', 'user_id'], auth.user_id)
                         .set('loading', false)
                         .set('received', true)
                         .set('success', true);

      let alert = {
        id: 'shared',
        data: [{
          needs_i18n: true,
          type: 'success',
          message: 'success.login'
        }]
      };

      if (Object.keys(remote_answers).length !== 0) {
        return loop(
          fromJS(updated),
          Effects.batch([
            Effects.constant(pushAlert(alert)),
            Effects.constant(updatedFootprintComputed(remote_answers))
          ])
        )
      } else {
        return loop(
          fromJS(updated),
          Effects.constant(pushAlert(alert))
        )
      }

    } else {
      let err = JSON.parse(api_response.error);

      let updated = state.set('loading', false)
                         .set('received', true)
                         .set('success', false);

      let alert = {
        id: 'login',
        data: [{
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

    let updated, alert;

    if (api_response.success) {
      let auth = {
        token: api_response.data.token,
        name: api_response.data.name,
        user_id: api_response.data.user_id
      };

      setLocalStorageItem('auth', auth);

      updated = state.setIn(['data', 'token'], auth.token)
                     .setIn(['data', 'name'], auth.name)
                     .setIn(['data', 'user_id'], auth.user_id)
                     .set('loading', false)
                     .set('received', true)
                     .set('success', true);

      alert = {
        id: 'shared',
        data: [{
          needs_i18n: true,
          type: 'success',
          message: 'success.sign_up'
        }]
      };

    } else {

      let err;
      alert = {
        id: 'sign_up',
        data: []
      }

      try {
        err = JSON.parse(api_response.error);
        alert.data.push({
          needs_i18n: true,
          type: 'danger',
          message: 'errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0]
        });
      } catch (err){
        alert.data.push({
          needs_i18n: true,
          type: 'danger',
          message: 'errors.email.non-unique'
        });
      }

      updated = state.set('loading', false)
                     .set('received', true)
                     .set('success', false)
    }

    return loop(
     fromJS(updated),
     Effects.constant(pushAlert(alert))
    )
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
                         .deleteIn(['data', 'user_id'])
                         .set('loading', false)
                         .delete('received')
                         .delete('success');
      let alert = {
        id: 'shared',
        data: [{
          needs_i18n: true,
          type: 'success',
          message: 'success.logout'
        }]
      };

      return loop(
        fromJS(updated),
        Effects.batch([
          Effects.constant(averageFootprintResetRequested()),
          Effects.constant(pushAlert(alert))
        ])
      )
    }
  },

  [requestNewPassword]: (state, payload)=>{
    return loop(
      state.set('loading', true),
      Effects.promise(()=>{
        return forgotPassword(payload)
          .then(newPasswordRequested)
          .catch(authError)
      })
    )
  },

  [newPasswordRequested]: (state, api_response)=>{

    let updated = state.set('loading', false)
                       .set('received', true);
    let alert = {
      id: 'forgot_password'
    }

    if (api_response.success) {
      alert.data = [{
        needs_i18n: true,
        type: 'success',
        message: 'success.forgot_password'
      }];
    } else {
      alert.data = [{
        needs_i18n: true,
        type: 'danger',
        message: api_response.error
      }];
    }

    return loop(
      fromJS(updated),
      Effects.constant(pushAlert(alert))
    )
  },

  [authError]: (state, _payload)=>{
    return state.set('success', false)
  }

};

const REDUCER = createReducer(ACTIONS, {});

export default REDUCER;
