/*global module*/

import React from 'react';

import { logoutUser } from 'api/user.api';
import Translatable from 'shared/lib/base_classes/translatable';
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
      token = logout.state_manager.state.auth.token,
      alert = {};

    alert.id = 'shared';
    alert.reset = true;
    logout.props.pushAlert(alert);

    if(token) {
      logoutUser(token).then((res)=>{
        if (res.success) {
          // user logged out

          delete logout.state_manager.state.auth;
          logout.state_manager.state.auth = {};
          localStorage.removeItem('auth');
          logout.state_manager.setUserFootprintStorageToDefault()
          logout.router.goToRouteByName('GetStarted')
          let alert = {};
          alert.id = 'shared';
          alert.data = {
            route: logout.current_route_name,
            type: 'success',
            message: logout.t('success.logout')
          };
          logout.props.pushAlert(alert);

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
