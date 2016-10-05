/*global module*/

import React from 'react';

import { addUser } from 'api/user.api';
import { validateParameter } from 'shared/lib/utils/utils';
import Panel from 'shared/lib/base_classes/panel';
import template from './sign_up.rt.html';
import authContainer from 'shared/containers/auth.container';
import { authPropTypes } from 'shared/containers/auth.container';

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
      answers: '',
      public: true
    };
  }

  get alert_list() {
    return  this.props.ui.getIn(['alerts', 'sign_up']).toJS();
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
        all_valid = Object.values(sign_up.valid).filter(item => item === false),
        alerts = {
          id: 'sign_up',
          data: []
        };

    for (let key in sign_up.valid) {
      let value = sign_up.valid[key]
      if (value === false) {
        let item = {
          type: 'danger',
          message: sign_up.t('sign_up.' + key) + ' ' + sign_up.t('errors.invalid')
        };
        alerts.data.push(item)
      }
    }

    if (all_valid[0] === false) {
      sign_up.props.pushAlert(alerts)
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

  updateCheckbox() {
    this.setState({
      public: !this.state.public
    })
  }

  submitSignup(event) {
    event.preventDefault();
    if (this.validateAll()) this.props.signup(this.state);
  }

  render() {
    return template.call(this);
  }

}

SignUpComponent.NAME = 'SignUp';
SignUpComponent.propTypes = authPropTypes;

module.exports = authContainer(SignUpComponent);
