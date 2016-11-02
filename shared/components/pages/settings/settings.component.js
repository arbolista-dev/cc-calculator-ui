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

  get user_id(){
    return this.props.auth.getIn(['data', 'user_id'])
  }

  viewProfile(){
    this.goToProfile(this.user_id);
  }

  render(){
    return template.call(this);
  }

}

SettingsComponent.propTypes = footprintPropTypes;
SettingsComponent.NAME = 'Settings';

module.exports = footprintContainer(SettingsComponent);
