/*global module*/

import React from 'react';

import Translatable from './../../lib/base_classes/translatable';
import template from './graphs.rt.html'

class GraphsComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let graphs = this;
    graphs.state = {};
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

GraphsComponent.NAME = 'Graphs';

module.exports = GraphsComponent;
