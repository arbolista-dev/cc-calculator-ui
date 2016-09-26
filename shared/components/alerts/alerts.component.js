/*global module*/

import React from 'react';

import Translatable from './../../lib/base_classes/translatable';
import template from './alerts.rt.html'

class AlertsComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let alerts = this;
    alerts.state = {}
  }

  get not_empty(){
    return this.props.list.length != 0
  }

  componentDidUpdate(){
    let alerts = this;

    if (alerts.not_empty) {

      for (let i = 0; i < alerts.props.list.length; i++ ) {
        if (alerts.props.list[i].route !== this.props.currentRoute) {
          let alarm = {};
          alarm.id = 'leaders';
          alarm.reset = true;
          alerts.props.pushAlert(alarm);
        }
      }
    }
  }

  render(){
    return template.call(this);
  }

}

AlertsComponent.propTypes = {
  list: React.PropTypes.array.isRequired,
  category: React.PropTypes.string.isRequired,
  currentRoute: React.PropTypes.string.isRequired,
  pushAlert: React.PropTypes.func.isRequired
};

AlertsComponent.NAME = 'Alerts';

module.exports = AlertsComponent;
