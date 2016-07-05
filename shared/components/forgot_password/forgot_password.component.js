/*global module*/

import React from 'react';

import {auth} from './../../lib/auth/auth';
import Panel from './../../lib/base_classes/panel';
import template from './forgot_password.rt.html'

class ForgotPasswordComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let forgot_password = this;
    forgot_password.valid = {
      email: '',
    };
    forgot_password.state = {
      email: '',
    };
  }

  componentDidMount() {
    let forgot_password = this;
  }

  paramValid(param){
    let forgot_password = this;

    if(forgot_password.state[param].length > 0) {
      return forgot_password.valid[param];
    } else {
      return true;
    }
  }

  validateInput(input) {
    let forgot_password = this,
        key = Object.keys(input)[0],
        value = Object.values(input)[0],
        re;
    switch (key) {
      case "email":
        re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        break;
      default:
        break;
    }
    let test = re.test(value);
    forgot_password.valid[key] = test;
  }

  validateAll(){
    let forgot_password = this,
        all_valid = Object.values(forgot_password.valid).filter(item => item === false);

    for (let key in forgot_password.valid) {
      let value = forgot_password.valid[key]
      if (value === false) {
        forgot_password.state_manager.state.alerts.push({type: 'danger', message: forgot_password.t('forgot_password.' + key) + " is not valid."});
        forgot_password.state_manager.syncLayout();
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

    let forgot_password = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };
    forgot_password.validateInput(update);
    forgot_password.setState(update);
  }

  submitForgotPassword(event) {
    event.preventDefault();
    let forgot_password = this;

    if (forgot_password.validateAll()) {
      auth.forgotPassword(forgot_password.state).then((res)=>{
        if (res.success) {

          let login = this.router.routes.filter((route) => {
            return route.route_name === 'Login';
          });
          this.router.goToRoute(login[0]);
          forgot_password.state_manager.state.alerts.push({type: 'success', message: "Please check your emails and reset your password."});
        } else {
          // failed
          forgot_password.state_manager.state.alerts.push({type: 'danger', message: res.error});
          forgot_password.state_manager.syncLayout();
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
ForgotPasswordComponent.NAME = 'ForgotPassword';

module.exports = ForgotPasswordComponent;
