/*global module*/

import React from 'react';

import { logoutUser } from 'api/user.api';
import Translatable from './../../../lib/base_classes/translatable';
import template from './logout.rt.html';

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
    logout.state_manager.state.alerts.shared = [];

    if(token) {
      logoutUser(token).then((res)=>{
        if (res.success) {
          // user logged out

          delete logout.state_manager.state.auth;
          logout.state_manager.state.auth = {};
          localStorage.removeItem('auth');
          logout.state_manager.resetStoredUserFootprint().then(() => {
            logout.router.goToRouteByName('GetStarted')
            logout.state_manager.state.alerts.shared.push({type: 'success', message: logout.t('success.logout')});
          })

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
