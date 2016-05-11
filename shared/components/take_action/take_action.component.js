/*global module*/

import React from 'react';

import TranslatableComponent from '../translatable/translatable.component';
import template from './take_action.rt.html'

class TakeActionComponent extends TranslatableComponent {

  constructor(props, context){
    super(props, context);
    let take_action = this;
    take_action.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('take_action.title');
  }

  get router(){
    return this.props.router
  }

  componentDidMount() {
    let take_action = this;
  }

  updateResults(){
    let take_action = this;
  }

  render(){
    return template.call(this);
  }

}

TakeActionComponent.propTypes = {

};
TakeActionComponent.contextTypes = {
  i18n: React.PropTypes.any
}

TakeActionComponent.NAME = 'TakeAction';

module.exports = TakeActionComponent;
