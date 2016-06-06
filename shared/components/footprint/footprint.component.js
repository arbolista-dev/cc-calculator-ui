/*global module*/

import React from 'react';
import ComparativePie from 'd3-object-charts/src/pie/comparative';

import Panel from './../../lib/base_classes/panel';
import template from './footprint.rt.html'

const CATEGORIES = ['result_transport_total', 'result_housing_total',
  'result_food_total', 'result_goods_total', 'result_services_total'],
  MIN_GRAPH_WIDTH = 300,
  MAX_GRAPH_WIDTH = 800;

class FootprintComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let footprint = this;
    footprint.initResizeListener();
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

  get average_footprint_total(){
    return this.state_manager.average_footprint['result_grand_total'];
  }

  /*
   * Graph Drawing
   */

  get categories(){
    let graphs = this;
    return CATEGORIES.map((category_key)=>{
      return graphs.t(`categories.${category_key}`);
    });
  }

  get category_colors(){
    let graphs = this;
    return CATEGORIES.reduce((hash, category_key)=>{
      let translated = graphs.t(`categories.${category_key}`);
      hash[translated] = graphs.state_manager.category_colors[category_key];
      return hash;
    }, {});
  }

  get graph_dimensions(){
    let width = document.getElementById('overall_comparative_pie').offsetWidth,
        dimensions = {
          outer_width: width * 0.8
        };
    dimensions.outer_width = Math.max(
      MIN_GRAPH_WIDTH,
      dimensions.outer_width
    );
    dimensions.outer_width = Math.min(
      MAX_GRAPH_WIDTH,
      dimensions.outer_width
    );
    dimensions.outer_height = dimensions.outer_width / 2;
    return dimensions;
  }

  generateData(footprint){
    return CATEGORIES.map((category)=>{
      return footprint[category];
    });
  }

  initializeOverallChart(){
    let footprint = this,
        colors = footprint.category_colors,
        dimensions = footprint.graph_dimensions;
    footprint.chart = new ComparativePie({
      container: '#overall_comparative_pie',
      outer_width: dimensions.outer_width,
      outer_height: dimensions.outer_height,
      fnColor: (category)=>{
        return colors[category];
      }
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

  resize(){
    let footprint = this;
    footprint.chart.redraw(footprint.graph_dimensions);
  }

}

FootprintComponent.propTypes = {

};

FootprintComponent.NAME = 'Footprint';

module.exports = FootprintComponent;
