/*global module*/

import React from 'react';

import Translatable from './../../lib/base_classes/translatable';
import template from './flash_message.rt.html'

class FlashMessageComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let flash_message = this;
    flash_message.state = {}
  }

  get alerts_not_empty(){
    return this.props.alerts.length != 0
  }

  componentDidUpdate(){
    let flash_message = this;


    if (flash_message.alerts_not_empty) {
      let current_route = flash_message.router.current_route.key

      for (let i = 0; i < flash_message.state_manager.state.alerts.length; i++ ) {
        if (!flash_message.state_manager.state.alerts[i].initial_route) {
          flash_message.state_manager.state.alerts[i].initial_route = current_route
        }
        if (flash_message.state_manager.state.alerts[i].initial_route !== current_route) {
          flash_message.state_manager.state.alerts.splice(i, 1);
          flash_message.state_manager.syncLayout();
        }
      }

      // Hide Flash Message after 15 seconds
      // setTimeout(() => {
      //    flash_message.state_manager.state.alerts = [];
      //    flash_message.state_manager.syncLayout();
      // }, 15000);
    }
  }

  render(){
    return template.call(this);
  }

}

FlashMessageComponent.propTypes = {
  alerts: React.PropTypes.array.isRequired
};

FlashMessageComponent.NAME = 'FlashMessage';

module.exports = FlashMessageComponent;
