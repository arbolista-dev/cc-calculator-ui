/*global module*/

import React from 'react';

import { logoutUser } from 'api/user.api';
import Translatable from 'shared/lib/base_classes/translatable';
import template from './logout.rt.html';
import authContainer from 'shared/containers/auth.container';
import { authPropTypes } from 'shared/containers/auth.container';

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
    this.props.logout();
  }

}

LogoutComponent.NAME = 'Logout';
LogoutComponent.propTypes = authPropTypes;

module.exports = authContainer(LogoutComponent);
