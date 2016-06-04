/*global module*/

import React from 'react';
import c3 from 'c3';

import Panel from './../../lib/base_classes/panel';
import template from './graphs.rt.html'

class GraphsComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let graphs = this;
    graphs.state = {};
  }

  componentDidMount() {
    let graphs = this;
    graphs.initializeOverallChart();
  }

  updateResults(){
    let graphs = this;
  }

  render(){
    return template.call(this);
  }


  get categories(){

  }



  initializeOverallChart(){
    let graphs = this;

  }

}

GraphsComponent.propTypes = {

};

GraphsComponent.NAME = 'Graphs';

module.exports = GraphsComponent;
