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

  render() {
    return template.call(this);
  }

}

SettingsComponent.propTypes = footprintPropTypes;
SettingsComponent.NAME = 'Settings';

module.exports = footprintContainer(SettingsComponent);
