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
    return this.props.ui.getIn(['alerts', 'login']).toJS()
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
        let alert = {};
        alert.id = 'login';
        alert.data = {
          route: login.current_route_name,
          type: 'danger',
          message: login.t('login.' + key) + ' ' + login.t('errors.invalid')
        };
        login.props.pushAlert(alert);
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
    let login = this,
      alert = {};

    alert.id = 'shared';
    alert.reset = true;
    login.props.pushAlert(alert);
    alert.id = 'login';
    alert.reset = true;
    login.props.pushAlert(alert);


    if (login.validateAll()) {

      login.props.login(login.state);

      console.log('after login success', login.props.auth.get('success'));
      console.log('after login data', login.props.auth.get('data').toJS());
      // @ToDo: Check auth status to see if login successful
      // let alert = {};
      // alert.id = 'login';
      // alert.data = {
      //   route: login.current_route_name,
      //   type: 'success',
      //   message: login.t('success.login')
      // };
      // login.props.pushAlert(alert);
      // @ToDo: refactor goToRouteByName
      // login.router.goToRouteByName('GetStarted');

      // old:
      // loginUser(login.state).then((res)=>{
      //   if (res.success) {
      //     // user logged in
      //     let auth_res = {
      //           token: res.data.token,
      //           name: res.data.name
      //         }, remote_anwers = JSON.parse(res.data.answers);
      //
      //     Object.assign(login.state_manager.state.auth, auth_res);
      //     localStorage.setItem('auth', JSON.stringify(auth_res));
      //
      //     if (remote_anwers.length !== 0) {
      //       login.state_manager.setUserFootprint(remote_anwers);
      //     }
      //
      //
      //   } else {
      //     let err = JSON.parse(res.error);
      //
      //     let alert = {};
      //     alert.id = 'login';
      //     alert.data = {
      //       route: login.current_route_name,
      //       type: 'danger',
      //       message: login.t('errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0])
      //     };
      //     login.props.pushAlert(alert);
      //
      //   }
      //   return res
      // })
    } else {
      // input not valid
    }
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
