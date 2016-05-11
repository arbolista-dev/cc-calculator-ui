/*global module*/

import React from 'react';

import TranslatableComponent from '../translatable/translatable.component';
import template from './travel.rt.html'

class TravelComponent extends TranslatableComponent {

  constructor(props, context){
    super(props, context);
    let travel = this;
    travel.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('travel.title');
  }

  get router(){
    return this.props.router
  }

  componentDidMount() {
    let travel = this;
  }

  updateResults(){
    let travel = this;
  }

  render(){
    return template.call(this);
  }

}

TravelComponent.propTypes = {

};

TravelComponent.NAME = 'Travel';

module.exports = TravelComponent;
