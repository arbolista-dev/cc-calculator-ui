/*global module*/

import React from 'react';

import TranslatableComponent from '../translatable/translatable.component';
import template from './get_started.rt.html'

class GetStartedComponent extends TranslatableComponent {

  constructor(props, context){
    super(props, context);
    let get_started = this;
    get_started.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('get_started.title');
  }

  get router(){
    return this.props.router
  }

  componentDidMount() {
    let get_started = this;
  }

  updateResults(){
    let get_started = this;
  }

  render(){
    return template.call(this);
  }

}

GetStartedComponent.propTypes = {

};
GetStartedComponent.contextTypes = {
  i18n: React.PropTypes.any
}

GetStartedComponent.NAME = 'GetStarted';

module.exports = GetStartedComponent;
