/* global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './settings.rt.html';

class SettingsComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const settings = this;
    settings.state = {};
  }

  componentDidMount() {
    if (this.props.location.getIn(['query', 'type']) === 'confirm') {
      const alert = {
        id: 'shared',
        data: [{
          needs_i18n: true,
          type: 'success',
          message: 'confirmation.successful',
        }],
      };
      this.props.pushAlert(alert);
    }
  }

  render() {
    return template.call(this);
  }

  get reset_password() {
    return this.props.location.getIn(['query', 'type']) === 'reset' && this.props.auth.get('canReset');
  }

}

SettingsComponent.propTypes = footprintPropTypes;
SettingsComponent.NAME = 'Settings';

module.exports = footprintContainer(SettingsComponent);
