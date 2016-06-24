/*global module*/

import React from 'react';

import {auth} from './../../lib/auth/auth';
import Translatable from './../../lib/base_classes/translatable';
import template from './logout.rt.html'

class LogoutComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let logout = this;
    logout.state = {}
  }

  render(){
    return template.call(this);
  }

  submitLogout(event) {
    event.preventDefault();
    let logout = this,
        token = logout.state_manager.state.auth.token;

    if(token) {
      auth.logoutUser(token).then((res)=>{
        console.log('result', res)
        if (res.success) {
          // user logged out
          delete logout.state_manager.state.auth;
          logout.state_manager.state.auth = {};
          console.log('auth state', logout.state_manager.state);
          localStorage.removeItem('auth');
          logout.state_manager.syncLayout();
        } else {
          // user login failed
        }
        return res
      })
    }
  }

}

LogoutComponent.NAME = 'Logout';

module.exports = LogoutComponent;
