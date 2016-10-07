/*global module*/

import React from 'react';

import { forgotPassword } from 'api/user.api';
import { validateParameter } from 'shared/lib/utils/utils';
import Panel from 'shared/lib/base_classes/panel';
import template from './forgot_password.rt.html';
import authContainer from 'shared/containers/auth.container';
import { authPropTypes } from 'shared/containers/auth.container';

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

  render() {
    return template.call(this);
  }

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'forgot_password']).toJS();
  }

  paramValid(){
    let forgot_password = this;

    if(forgot_password.state.email.length > 0) {
      return forgot_password.valid.email;
    } else {
      return true;
    }
  }

  validateAll(){
    let forgot_password = this,
        valid = forgot_password.valid.email || false,
        alert = {
          id: 'forgot_password'
        };


    if (forgot_password.valid.email === false) {
      alert.data = [{
        type: 'danger',
        message: forgot_password.t('forgot_password.email') + ' ' + forgot_password.t('errors.invalid')
      }];
    }

    if (valid === false) {
      forgot_password.props.pushAlert(alert);
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
    if (this.validateAll()) this.props.requestNewPassword(this.state);
  }

}
ForgotPasswordComponent.NAME = 'ForgotPassword';
ForgotPasswordComponent.propTypes = authPropTypes;

module.exports = authContainer(ForgotPasswordComponent);
