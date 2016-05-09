/*global module*/

import React from 'react';

import TranslatableComponent from '../translatable/translatable.component';
import template from './missing.rt.html'

class MissingComponent extends TranslatableComponent {

  constructor(props, context){
    super(props, context);
    let missing = this;
    missing.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('missing.title');
  }

  componentDidMount() {
    let missing = this;
  }

  updateResults(){
    let missing = this;
  }

  render(){
    return template.call(this);
  }

}

MissingComponent.propTypes = {

};
MissingComponent.contextTypes = {
  i18n: React.PropTypes.any
}

MissingComponent.NAME = 'Missing';

module.exports = MissingComponent;
