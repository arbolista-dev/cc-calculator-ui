/*global module*/

import React from 'react';

import Panel from 'shared/lib/base_classes/panel';
import template from './settings.rt.html';
import footprintContainer from 'shared/containers/footprint.container';
import { footprintPropTypes } from 'shared/containers/footprint.container';

class SettingsComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let settings = this;
    settings.state = {}
  }

  setUserFootprintStorageToDefault(){
    let settings = this;

    settings.resetUserFootprint();
    settings.updateDefaults();

    let alert = {};
    alert.id = 'shared';
    alert.data = [{
      route: settings.current_route_name,
      type: 'success',
      message: settings.t('success.answers_reset')
    }];
    settings.props.pushAlert(alert);
  }

  render(){
    return template.call(this);
  }

}

SettingsComponent.propTypes = footprintPropTypes;
SettingsComponent.NAME = 'Settings';

module.exports = footprintContainer(SettingsComponent);
