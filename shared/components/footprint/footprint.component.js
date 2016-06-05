/*global module*/

import React from 'react';
import ComparativePie from 'd3-object-charts/src/pie/comparative';

import Panel from './../../lib/base_classes/panel';
import template from './footprint.rt.html'

const CATEGORIES = ['result_transport_total', 'result_housing_total',
  'result_food_total', 'result_goods_total', 'result_services_total'];

class FootprintComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let footprint = this;
    footprint.state = {}
  }

  componentDidMount() {
    let footprint = this;
    footprint.initializeOverallChart();
  }

  componentDidUpdate(){
    let footprint = this;
    footprint.drawData();
  }

  render(){
    return template.call(this);
  }

  get categories(){
    let graphs = this;
    return CATEGORIES.map((category_key)=>{
      return graphs.t(`categories.${category_key}`);
    });
  }

  get average_footprint_total(){
    return this.state_manager.average_footprint['result_grand_total'];
  }


  generateData(footprint){
    return CATEGORIES.map((category)=>{
      return footprint[category];
    });
  }

  initializeOverallChart(){
    let footprint = this;
    footprint.chart = new ComparativePie({
      container: '#overall_comparative_pie'
    });
    footprint.drawData();
  }

  drawData(){
    let footprint = this;
    footprint.chart.drawData({
      categories: footprint.categories,
      values: footprint.generateData(footprint.state_manager.user_footprint),
      comparative_sum: footprint.average_footprint_total
    })
  }

}

FootprintComponent.propTypes = {

};

FootprintComponent.NAME = 'Footprint';

module.exports = FootprintComponent;
