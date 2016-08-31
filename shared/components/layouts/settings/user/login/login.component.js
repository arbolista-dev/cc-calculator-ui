/*global module*/

import React from 'react';

import { loginUser } from 'api/user.api';
import { validateParameter } from 'shared/lib/utils/utils';
import Panel from 'shared/lib/base_classes/panel';
import template from './login.rt.html';

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

  componentDidMount() {
    let login = this;
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

    for (let key in login.valid) {
      let value = login.valid[key]
      if (value === false) {
        login.state_manager.state.alerts.push({type: 'danger', message: login.t('login.' + key) + " " + login.t('errors.invalid')});
        login.state_manager.syncLayout();
      }
    }

    if (all_valid[0] === false) {
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
    let login = this;
    login.state_manager.state.alerts = [];

    if (login.validateAll()) {
      loginUser(login.state).then((res)=>{
        if (res.success) {
          // user logged in
          let auth_res = {
            token: res.data.token,
            name: res.data.name
          }, remote_anwers = JSON.parse(res.data.answers);

          Object.assign(login.state_manager.state.auth, auth_res);
          localStorage.setItem('auth', JSON.stringify(auth_res));

          if (remote_anwers.length !== 0) {
            login.state_manager.setUserFootprint(remote_anwers);
          }


          login.state_manager.state.alerts.push({type: 'success', message: login.t('success.login')});
          login.router.goToUri('GetStarted');
        } else {
          let err = JSON.parse(res.error);

          login.state_manager.state.alerts.push({type: 'danger', message: login.t('errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0])});
          login.state_manager.syncLayout();
        }
        return res
      })
    } else {
      // input not valid
    }
  }

  goToForgotPassword() {
    this.router.goToUri('ForgotPassword')
  }

  render() {
    return template.call(this);
  }
}
LoginComponent.NAME = 'Login';

module.exports = LoginComponent;
