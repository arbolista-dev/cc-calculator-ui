/*global module*/

import React from 'react';

import { loginUser } from 'api/user.api';
import { validateParameter } from 'shared/lib/utils/utils';
import Panel from 'shared/lib/base_classes/panel';
import template from './login.rt.html';
import authContainer from 'shared/containers/auth.container';
import { authPropTypes } from 'shared/containers/auth.container';

class LoginComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let login = this;
    login.valid = {
      email: false,
      password: false,
    };
    login.state = {
      email: '',
      password: ''
    };
  }

  get alert_list() {
    let state_list = this.props.ui.getIn(['alerts', 'login']).toJS();
    if (state_list.length != 0){
      return state_list
    } else {
      return new Array()
    }
  }

  paramValid(param){
    let login = this;

    if(login.state[param].length > 0) {
      return login.valid[param];
    } else {
      return true;
    }
  }

  validateAll(){
    let login = this,
        all_valid = Object.values(login.valid).filter(item => item === false);

    let alert = {};
    alert.id = 'login';
    alert.data = [];

    for (let key in login.valid) {
      let value = login.valid[key]
      if (value === false) {
        let item = {
          route: login.current_route_name,
          type: 'danger',
          message: login.t('login.' + key) + ' ' + login.t('errors.invalid')
        };
        alert.data.push(item);
      }
    }

    if (all_valid[0] === false) {
      login.props.pushAlert(alert);
      return false;
    } else {
      return true;
    }
  }

  updateInput(event) {
    event.preventDefault();

    let login = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };

    login.valid[api_key] = validateParameter(update);
    login.setState(update);
  }

  submitLogin(event) {
    event.preventDefault();
    if (this.validateAll()) this.props.login(this.state);
  }

  goToForgotPassword() {
    this.router.goToRouteByName('ForgotPassword')
  }

  render() {
    return template.call(this);
  }
}

LoginComponent.NAME = 'Login';
LoginComponent.propTypes = Object.assign({}, {
  ui: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  pushAlert: React.PropTypes.func.isRequired
}, authPropTypes);

module.exports = authContainer(LoginComponent);
