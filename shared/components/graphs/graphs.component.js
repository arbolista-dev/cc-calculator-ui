/*global module*/

import React from 'react';

import TranslatableComponent from '../translatable/translatable.component';
import template from './graphs.rt.html'

class GraphsComponent extends TranslatableComponent {

  constructor(props, context){
    super(props, context);
    let graphs = this;
    graphs.state = {};
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('graphs.title');
  }

  componentDidMount() {
    let graphs = this;
  }

  updateResults(){
    let graphs = this;
  }

  render(){
    return template.call(this);
  }

}

GraphsComponent.propTypes = {

};
GraphsComponent.contextTypes = {
  i18n: React.PropTypes.any
}

GraphsComponent.NAME = 'Graphs';

module.exports = GraphsComponent;
