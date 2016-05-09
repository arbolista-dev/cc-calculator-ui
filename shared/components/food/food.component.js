/*global module*/

import React from 'react';

import TranslatableComponent from '../translatable/translatable.component';
import template from './food.rt.html'

class FoodComponent extends TranslatableComponent {

  constructor(props, context){
    super(props, context);
    let food = this;
    food.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('food.title');
  }

  componentDidMount() {
    let food = this;
  }

  updateResults(){
    let food = this;
  }

  render(){
    return template.call(this);
  }

}

FoodComponent.propTypes = {

};
FoodComponent.contextTypes = {
  i18n: React.PropTypes.any
}

FoodComponent.NAME = 'Food';

module.exports = FoodComponent;
