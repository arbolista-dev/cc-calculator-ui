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

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'forgot_password']).toJS();
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
        all_valid = Object.values(forgot_password.valid).filter(item => item === false),
        alert = {
          id: 'forgot_password'
        };

    for (let key in forgot_password.valid) {
      let value = forgot_password.valid[key]
      if (value === false) {
        alert.data = [{
          type: 'danger',
          message: forgot_password.t('forgot_password.' + key) + ' ' + forgot_password.t('errors.invalid')
        }];
      }
    }

    if (all_valid[0] === false) {
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

  render() {
    return template.call(this);
  }
}
ForgotPasswordComponent.NAME = 'ForgotPassword';
ForgotPasswordComponent.propTypes = Object.assign({}, {
  ui: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  pushAlert: React.PropTypes.func.isRequired
}, authPropTypes);

module.exports = authContainer(ForgotPasswordComponent);
