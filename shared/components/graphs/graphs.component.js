/*global module*/

import React from 'react';
import OverlapBar from 'd3-object-charts/src/bar/overlap';

import Panel from '../../lib/base_classes/panel';
import template from './graphs.rt.html'

const CATEGORIES = ['result_transport_total', 'result_housing_total',
  'result_food_total', 'result_goods_total', 'result_services_total'],
  MIN_GRAPH_WIDTH = 300,
  MAX_GRAPH_WIDTH = 800;

class GraphsComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let graphs = this;
    graphs.initResizeListener();
    graphs.state = {};
  }

  componentDidMount() {
    let graphs = this;
    graphs.initializeOverallChart();
  }

  componentDidUpdate(){
    let graphs = this;
    graphs.drawData();
  }

  render(){
    return template.call(this);
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

  get graph_dimensions(){
    let width = window.outerWidth,
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
    let graphs = this,
        dimensions = graphs.graph_dimensions;
    graphs.chart = new OverlapBar({
      outer_height: dimensions.outer_height,
      outer_width: dimensions.outer_width,
      container: '#overview_chart',
      y_ticks: 5,
      seriesClass: function(series){
        return series.name.replace(/\s+/g, '-').toLowerCase();
      }
    });
    graphs.drawData();
  }

  drawData(){
    let graphs = this;
    graphs.chart.drawData({
      categories: graphs.categories,
      series: [
        {
          name: graphs.t('graphs.your_footprint'),
          values: graphs.generateData(graphs.state_manager.user_footprint)
        }, {
          name: graphs.t('graphs.average_footprint'),
          values: graphs.generateData(graphs.state_manager.average_footprint)
        }
      ]
    });
  }

  resize(){
    let graphs = this;
    graphs.chart.redraw(graphs.graph_dimensions);
  }

}

GraphsComponent.propTypes = {};

GraphsComponent.NAME = 'Graphs';

module.exports = GraphsComponent;
