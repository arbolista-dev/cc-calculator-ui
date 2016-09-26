/*global module*/

import React from 'react';

import { forgotPassword } from 'api/user.api';
import { validateParameter } from 'shared/lib/utils/utils';
import Panel from 'shared/lib/base_classes/panel';
import template from './forgot_password.rt.html';

class ForgotPasswordComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let forgot_password = this;
    forgot_password.valid = {
      email: false
    };
    forgot_password.state = {
      email: ''
    };
  }

  get alert_list() {
    return this.state_manager.state.alerts.forgot_password;
  }

  paramValid(param){
    let forgot_password = this;

    if(forgot_password.state[param].length > 0) {
      return forgot_password.valid[param];
    } else {
      return true;
    }
  }

  validateAll(){
    let forgot_password = this,
        all_valid = Object.values(forgot_password.valid).filter(item => item === false);

    for (let key in forgot_password.valid) {
      let value = forgot_password.valid[key]
      if (value === false) {
        forgot_password.state_manager.state.alerts.forgot_password.push({type: 'danger', message: forgot_password.t('forgot_password.' + key) + ' ' + forgot_password.t('errors.invalid')});
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

    forgot_password.valid[api_key] = validateParameter(update);
    forgot_password.setState(update);
  }

  submitForgotPassword(event) {
    event.preventDefault();
    let forgot_password = this;
    forgot_password.state_manager.state.alerts.forgot_password = [];

    if (forgot_password.validateAll()) {
      forgotPassword(forgot_password.state).then((res)=>{
        if (res.success) {

          forgot_password.router.goToRouteByName('Login')

          forgot_password.state_manager.state.alerts.forgot_password.push({type: 'success', message: forgot_password.t('success.forgot_password')});
        } else {
          // failed
          forgot_password.state_manager.state.alerts.forgot_password.push({type: 'danger', message: forgot_password.t('errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0])});
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
