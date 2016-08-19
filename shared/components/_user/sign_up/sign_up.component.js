/*global module*/

import React from 'react';

import { addUser } from 'api/user.api';
import { validateParameter } from './../../../lib/utils/utils';
import Panel from './../../../lib/base_classes/panel';
import template from './sign_up.rt.html';


class SignUpComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let sign_up = this;
    sign_up.valid = {
      first_name: false,
      last_name: false,
      email: false,
      password: false
    };
    sign_up.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      answers: ''
    };
  }

  get alert_list() {
    return this.state_manager.state.alerts.sign_up;
  }

  componentDidMount() {
    let sign_up = this;
  }

  paramValid(param){
    let sign_up = this;

    if(sign_up.state[param].length > 0) {
      return sign_up.valid[param];
    } else {
      return true;
    }
  }

  validateAll(){
    let sign_up = this,
        all_valid = Object.values(sign_up.valid).filter(item => item === false);

    for (let key in sign_up.valid) {
      let value = sign_up.valid[key]
      if (value === false) {
        sign_up.state_manager.state.alerts.sign_up.push({type: 'danger', message: sign_up.t('sign_up.' + key) + " " + sign_up.t('errors.invalid')});
        sign_up.state_manager.syncLayout();
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

    let sign_up = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };

    sign_up.valid[api_key] = validateParameter(update);
    sign_up.setState(update);
  }

  submitSignup(event) {
    event.preventDefault();
    let sign_up = this;
    sign_up.state_manager.state.alerts.sign_up = [];

    if (sign_up.validateAll()) {
      addUser(sign_up.state).then((res)=>{
        if (res.success) {
          // user added
          let auth_res = {
            token: res.data.token,
            name: res.data.name
          };

          Object.assign(sign_up.state_manager.state.auth, auth_res);
          localStorage.setItem('auth', JSON.stringify(auth_res));

          sign_up.state_manager.state.alerts.sign_up.push({type: 'success', message: sign_up.t('success.sign_up')});
          sign_up.router.goToRouteByName('GetStarted');
        } else {
          let err;
          try {
            err = JSON.parse(res.error);
            sign_up.state_manager.state.alerts.sign_up.push({type: 'danger', message: sign_up.t('errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0])});
            sign_up.state_manager.syncLayout();
          } catch (err){
            sign_up.state_manager.state.alerts.sign_up.push({type: 'danger', message: sign_up.t('errors.email.non-unique')});
            sign_up.state_manager.syncLayout();
          }
        }
        return res
      })
    }
  }

  render() {
    return template.call(this);
  }

}

SignUpComponent.NAME = 'SignUp';

module.exports = SignUpComponent;
