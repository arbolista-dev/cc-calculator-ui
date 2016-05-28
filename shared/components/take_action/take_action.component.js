/*global module*/

import React from 'react';

import Action from './action';
import Panel from './../../lib/base_classes/panel';
import template from './take_action.rt.html'

class TakeActionComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let take_action = this;
    take_action.action_keys = Object.keys(take_action.result_takeaction_pounds)
      .filter(key=> !/^offset_/.test(key));
console.log('hi')
    take_action.actions = take_action
      .action_keys
      .map((action_key)=>{
        return new Action(action_key, take_action);
      });
    take_action.state = take_action.userApiState();
    take_action.state['actions'] = take_action.actions;
  }

  get relevant_api_keys(){
    return this.action_keys;
  }

  get result_takeaction_pounds(){
    return this.state_manager['result_takeaction_pounds'];
  }

  get result_takeaction_dollars(){
    return this.state_manager['result_takeaction_dollars'];
  }

  get result_takeaction_net10yr(){
    return this.state_manager['result_takeaction_net10yr'];
  }

  toggleActionDetails(action){
    let take_action = this;

    action.detailed = !action.detailed;
    take_action.setState({
      actions: take_action.actions
    })
  }

  toggleAction(action){
    let take_action = this,
      update = {};
    if (action.taken){
      update[action.api_key] = 0;
    } else {
      update[action.api_key] = 1;
    }
    take_action.setState(update);
    take_action.updateTakeaction(update);
  }

  updateTakeaction(params){
    let take_action = this;
    take_action.updateFootprintParams(params);

    // debounce updating take action results by 500ms.
    if (take_action.$update_takeaction) {
      clearTimeout(take_action.$update_takeaction);
    }

    take_action.$update_takeaction = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      take_action.state_manager.updateTakeactionResults()
        .then(()=>{
          let user_api_state = take_action.userApiState();
          take_action.setState(user_api_state);
        });
    }, 500);
  }


  render(){
    return template.call(this);
  }

}

TakeActionComponent.NAME = 'TakeAction';

module.exports = TakeActionComponent;
