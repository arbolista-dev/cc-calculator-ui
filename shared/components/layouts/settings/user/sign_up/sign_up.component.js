/*global module*/

import React from 'react';

import { addUser } from 'api/user.api';
import { validateParameter } from 'shared/lib/utils/utils';
import Panel from 'shared/lib/base_classes/panel';
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
      answers: '',
      public: true
    };
  }

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'sign_up']).toJS()
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
        let alert = {};
        alert.id = 'sign_up';
        alert.data = {
          route: sign_up.current_route_name,
          type: 'danger',
          message: sign_up.t('sign_up.' + key) + ' ' + sign_up.t('errors.invalid')
        };
        sign_up.props.pushAlert(alert);
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

  updateCheckbox() {
    this.setState({
      public: !this.state.public
    })
  }

  submitSignup(event) {
    event.preventDefault();
    let sign_up = this,
      alert = {};

    alert.id = 'sign_up';
    alert.reset = true;
    sign_up.props.pushAlert(alert);

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

          let alert = {};
          alert.id = 'sign_up';
          alert.data = {
            route: sign_up.current_route_name,
            type: 'success',
            message: sign_up.t('success.sign_up')
          };
          sign_up.props.pushAlert(alert);

          // @ToDo: refactor goToRouteByName
          sign_up.router.goToRouteByName('GetStarted');
        } else {
          let err,
            alert = {};
          alert.id = 'sign_up';
          alert.data = {
            route: sign_up.current_route_name,
            type: 'danger',
          };
          try {
            err = JSON.parse(res.error);
            alert.data.message = sign_up.t('errors.' + Object.keys(err)[0] + '.' + Object.values(err)[0]);

          } catch (err){
            alert.data.message = sign_up.t('errors.email.non-unique');

          } finally {
            sign_up.props.pushAlert(alert);

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
SignUpComponent.propTypes = {
  ui: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  pushAlert: React.PropTypes.func.isRequired
};

module.exports = SignUpComponent;
