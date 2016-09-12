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

  // componentDidUpdate(){
  //   let alerts = this;
  //
  //   if (alerts.not_empty) {
  //     let current_route = alerts.router.current_route.key
  //
  //     for (let i = 0; i < alerts.state_manager.state.alerts[this.props.type].length; i++ ) {
  //       if (!alerts.state_manager.state.alerts[this.props.type][i].initial_route) {
  //         alerts.state_manager.state.alerts[this.props.type][i].initial_route = current_route
  //       }
  //       if (alerts.state_manager.state.alerts[this.props.type][i].initial_route !== current_route) {
  //         alerts.state_manager.state.alerts[this.props.type].splice(i, 1);
  //         alerts.state_manager.syncLayout();
  //       }
  //     }
  //   }
  // }

  render(){
    return template.call(this);
  }

}

AlertsComponent.propTypes = {
  list: React.PropTypes.array.isRequired,
  type: React.PropTypes.string.isRequired
};

AlertsComponent.NAME = 'Alerts';

module.exports = AlertsComponent;
