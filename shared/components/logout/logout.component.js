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
        if (res.success) {
          // user logged out
          delete logout.state_manager.state.auth;
          logout.state_manager.state.auth = {};
          localStorage.removeItem('auth');
          logout.state_manager.state.alerts.push({type: 'success', message: "You've been logged out!"});
          logout.state_manager.setUserFootprintStorageToDefault();
        } else {
          // user logout failed?!
        }
        return res
      })
    }
  }

}

LogoutComponent.NAME = 'Logout';

module.exports = LogoutComponent;
