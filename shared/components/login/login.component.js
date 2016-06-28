/*global module*/

import React from 'react';

import {auth} from './../../lib/auth/auth';
import Panel from './../../lib/base_classes/panel';
import template from './login.rt.html'

class LoginComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let login = this;
    login.valid = {
      email: '',
      password: '',
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

  validateInput(input) {
    let login = this,
        key = Object.keys(input)[0],
        value = Object.values(input)[0],
        re;
    switch (key) {
      case "email":
        re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        break;
      case "password":
        re = /^[A-Za-z0-9!@#$%^&*()_]{4,30}$/;
        break;
      default:
        console.log('Unknown key: ', key);
    }
    let test = re.test(value);
    login.valid[key] = test;
  }

  validateAll(){
    let login = this,
        all_valid = Object.values(login.valid).filter(item => item === false);

    for (let key in login.valid) {
      let value = login.valid[key]
      if (value === false) {
        login.state_manager.state.alerts.push({type: 'error', message: login.t('login.' + key) + " is not valid."});
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
    login.validateInput(update);
    login.setState(update);
  }

  submitLogin(event) {
    event.preventDefault();
    let login = this;

    if (login.validateAll()) {
      auth.loginUser(login.state).then((res)=>{
        console.log('result', res)
        if (res.success) {
          // user logged in
          let auth_res = {
            token: res.data.token,
            name: res.data.name
          }
          Object.assign(login.state_manager.state.auth, auth_res);
          localStorage.setItem('auth', JSON.stringify(auth_res));
          // @ToDo: check if answers: {'...'} is returned
          // if true, don't call updateUserAnswers() but instead overwrite local user footprint with remote one

          login.state_manager.updateUserAnswers();
          login.state_manager.state.alerts.push({type: 'success', message: "You're logged in!"});
          login.state_manager.syncLayout();
          let get_started = this.router.routes.filter((route) => {
                return route.route_name === 'GetStarted';
              });
          this.router.goToRoute(get_started[0]);
        } else {
          // failed
          login.state_manager.state.alerts.push({type: 'error', message: res.error});
          login.state_manager.syncLayout();
        }
        return res
      })
    } else {
      // input not valid
    }
  }

  render() {
    return template.call(this);
  }
}
LoginComponent.NAME = 'Login';

module.exports = LoginComponent;
