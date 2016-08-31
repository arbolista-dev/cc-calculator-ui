import * as Immutable from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { addUser, loginUser, logoutUser, forgotPassword } from 'api/user.api';
import { signup, login, loggedIn, logout, loggedOut, authError } from './auth.actions';
import { setLocalStorageItem } from '../../lib/utils/utils';

const BLANK_SESSION = { token: null, loading: false, load_error: false };

/*
{
  token: <String>,
  name: <String>,
  loading: <Boolean>,
  load_error: <Boolean>
}
*/

const ACTIONS = {

  [signup]: (current_session)=>{

  },

  [login]: (current_session)=>{

  },

  [loggedIn]: (_current_session, new_token)=>{

  },

  [logout]: (current_session)=>{

  },

  [loggedOut]: (_current_session, _res)=>{

  },

  [authError]: (_current_session, _res)=>{

  }

};

const REDUCER = createReducer(ACTIONS, BLANK_SESSION);

export default REDUCER;
