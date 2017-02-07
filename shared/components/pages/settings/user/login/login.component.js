/* global module APP_ID*/
/* eslint react/jsx-filename-extension: 1 */


import React from 'react';
import FacebookLogin from 'react-facebook-login';
import Panel from 'shared/lib/base_classes/panel';
import { validateParameter } from 'shared/lib/utils/utils';
import authContainer, { authPropTypes } from 'shared/containers/auth.container';
import template from './login.rt.html';

const appId = APP_ID;
class LoginComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const login = this;
    login.valid = {
      email: false,
      password: false,
    };
    login.state = {
      email: '',
      password: '',
    };
    login.responseFacebook = login.responseFacebook.bind(login);
  }

  render() {
    return template.call(this);
  }
  facebookLogin() {
    const login = this;
    return (<
            FacebookLogin appId={appId}
      autoLoad={false}
      fields="name,email,picture"
      cssClass="cc-component__login-facebook"
      callback={login.responseFacebook}
      textButton={login.t('login.facebook')}
      icon="fa-facebook"
    />
    );
  }

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'login']).toJS();
  }

  paramValid(param) {
    const login = this;

    if (login.state[param].length > 0) return login.valid[param];
    return true;
  }

  validateAll() {
    const login = this;
    const all_valid = Object.values(login.valid).filter(item => item === false);
    if (all_valid.length > 0) {
      const alerts = {
        id: 'login',
        data: [],
      };
      Object.keys(login.valid).forEach((key) => {
        if (login.valid[key] === false) {
          const item = {
            type: 'danger',
            message: `${login.t(`login.${key}`)} ${login.t('errors.invalid')}`,
          };
          alerts.data.push(item);
        }
      });
      login.props.pushAlert(alerts);
      return false;
    }
    return true;
  }

  updateInput(event) {
    event.preventDefault();

    const login = this;
    const api_key = event.target.dataset.api_key;
    const update = {
      [api_key]: event.target.value,
    };

    login.valid[api_key] = validateParameter(update);
    login.setState(update);
  }

  submitLogin(event) {
    event.preventDefault();
    if (this.validateAll()) this.props.login(this.state);
  }

  responseFacebook(response) {
    if (response.status === 'unknown') {
      return;
    }
    const login = {
      facebookID: response.userID,
      facebookToken: response.accessToken,
    };
    this.props.loginFacebook(login);
  }
}

LoginComponent.NAME = 'Login';
LoginComponent.propTypes = authPropTypes;

module.exports = authContainer(LoginComponent);
