/* global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import { validateParameter } from 'shared/lib/utils/utils';
import authContainer, { authPropTypes } from 'shared/containers/auth.container';
import template from './reset.rt.html';

class ResetComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const reset = this;
    reset.valid = {
      password: false,
    };
    reset.state = {
      password: '',
    };
  }

  render() {
    return template.call(this);
  }

  paramValid(param) {
    const reset = this;

    if (reset.state[param].length > 0) {
      return reset.valid[param];
    }
    return true;
  }

  validateAll() {
    const reset = this;
    const all_valid = Object.values(reset.valid).filter(item => item === false);
    if (all_valid.length > 0) {
      const alerts = {
        id: 'reset',
        data: [],
      };
      Object.keys(reset.valid).forEach((key) => {
        if (reset.valid[key] === false) {
          const item = {
            type: 'danger',
            message: `${reset.t(`reset.${key}`)} ${reset.t('errors.invalid')}`,
          };
          alerts.data.push(item);
        }
      });
      reset.props.pushAlert(alerts);
      return false;
    }
    return true;
  }

  updateInput(event) {
    event.preventDefault();

    const reset = this;
    const api_key = event.target.dataset.api_key;
    const update = {
      [api_key]: event.target.value,
    };

    reset.valid[api_key] = validateParameter(update);
    reset.setState(update);
  }


  submitReset(event) {
    const reset = this;
    event.preventDefault();
    if (reset.validateAll()) {
      const state_input = {
        id: Number(reset.props.location.getIn(['query', 'id'])),
        token: reset.props.location.getIn(['query', 'token']),
        password: reset.state.password,
      };
      reset.props.resetPassword(state_input);
    }
  }

}

ResetComponent.NAME = 'Reset';
ResetComponent.propTypes = authPropTypes;

module.exports = authContainer(ResetComponent);
