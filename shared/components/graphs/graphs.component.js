/*global module*/

import React from 'react';
import OverlapBar from 'd3-object-charts/src/bar/overlap';
import ComparativePie from 'd3-object-charts/src/pie/comparative';

import Panel from '../../lib/base_classes/panel';
import template from './graphs.rt.html'

const CATEGORIES = ['result_transport_total', 'result_housing_total',
  'result_food_total', 'result_goods_total', 'result_services_total'],
  MIN_GRAPH_WIDTH = 250,
  MAX_GRAPH_WIDTH = 800;

class GraphsComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let graphs = this;
    graphs.state = {
      show_chart: true,
      chart_type: 'bar'
    };
    graphs.initResizeListener();
  }

  get show_pie_chart(){
    return this.state_manager.state.chart.show &&
      this.state_manager.state.chart.type === 'pie';
  }

  get show_bar_chart(){
    return this.state_manager.state.chart.show &&
      this.state_manager.state.chart.type === 'bar';
  }

  toggleChartType(type){
    this.hidePopovers()
    if (this.state_manager.state.chart.type === type){
      this.state_manager.state.chart.show = false;
      this.state_manager.state.chart.type = undefined;
    } else {
      this.state_manager.state.chart.show = true;
      this.state_manager.state.chart.type = type;

    }

    this.state_manager.syncLayout();
    setTimeout(()=>{
      if (this.show_pie_chart){
        this.drawPieChart();
      } else if (this.show_bar_chart) {
        this.initializeOverallBarChart();
      }
      window.jQuery("html, body").animate({ scrollTop: window.jQuery(document).height() }, 1000);
    }, 400)
  }

  componentDidMount() {
    let graphs = this;
    if (window.innerWidth < 992) {
      graphs.setState({
        show_chart: false
      });
    }
    if (this.show_pie_chart){
      graphs.drawPieChart();
    } else if (this.show_bar_chart) {
      graphs.initializeOverallBarChart();
    }
  }

  componentDidUpdate(){
    let graphs = this;
    if (this.show_pie_chart){
      graphs.drawPieChart();
    } else if (this.show_bar_chart) {
      graphs.initializeOverallBarChart();
    }
    graphs.hidePopovers();
  }

  componentWillUnmount(){
    this.hidePopovers();
  }

  hidePopovers(){
    window.jQuery(".d3-value-arc text").popover('hide');
    window.jQuery(".your-footprint").popover('hide');
  }

  render(){
    return template.call(this);
  }

  shouldShowTotal(){
    if (this.current_route_name === 'GetStarted' || this.current_route_name === 'Footprint' || this.current_route_name === 'TakeAction') {
      return false;
    } else {
      return true;
    }
  }

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

  generateData(footprint){
    return CATEGORIES.map((category)=>{
      return footprint[category];
    });
  }

  resize(){
    let graphs = this;
    graphs.bar_chart.redraw(graphs.graph_dimensions);
    if (graphs.pie_chart){
      graphs.pie_chart.redraw(graphs.graph_dimensions);
    }
  }

  get graph_dimensions(){
    let width = document.getElementById('graphs').offsetWidth,
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
    dimensions.outer_height = Math.max(300, dimensions.outer_width / 2);
    return dimensions;
  }

  /*
   * Bar Chart
   */

  initializeOverallBarChart(){
    let graphs = this,
        dimensions = graphs.graph_dimensions;
    document.getElementById('overview_bar_chart').innerHTML = '';
    graphs.bar_chart = new OverlapBar({
      outer_height: dimensions.outer_height,
      outer_width: dimensions.outer_width,
      container: '#overview_bar_chart',
      y_ticks: 5,
      margin:{top: 4, bottom: 30, left: 40, right: 0},
      seriesClass: function(series){
        return series.name.replace(/\s+/g, '-').toLowerCase();
      }
    });
    graphs.drawBarData();
  }

  drawBarData(){
    let graphs = this;
    graphs.bar_chart.drawData({
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
    graphs.initializeBarPopovers();
  }

  initializeBarPopovers(){
    let component = this;
    window.jQuery('.your-footprint').popover({
      placement: 'top',
      html: true,
      container: 'body',
      trigger: 'hover',
      content: function(){
        let klasses = window.jQuery(this)
          .attr('class').split(' '),
          category = klasses[klasses.length - 1];
        return component.popoverContentForCategory(category)
      }

    });
  }

  /*
   * Pie Chart
   */

  get pie_margins(){
    return {
      top: 30,
      left: 50,
      right: 50,
      bottom: 30
    }
  }

  get average_footprint_total(){
    return this.state_manager.average_footprint['result_grand_total'];
  }

  // Don't redraw pie data. The average and user values
  // will be drawn out of order, hiding smaller value.
  // Instead, wipe the chart and completely redraw.
  drawPieChart(){
    let component = this,
        colors = component.category_colors,
        dimensions = component.graph_dimensions;
    document.getElementById('overall_comparative_pie').innerHTML = '';
    component.pie_chart = new ComparativePie({
      container: '#overall_comparative_pie',
      outer_width: dimensions.outer_width,
      outer_height: dimensions.outer_height,
      margin: component.pie_margins,
      label_r: 30,
      fnColor: (category)=>{
        return colors[category];
      }
    });
    component.pie_chart.drawData({
      categories: component.categories,
      values: component.generateData(component.state_manager.user_footprint),
      comparative_sum: component.average_footprint_total
    })
    component.initializePiePopovers();
  }

  initializePiePopovers(){
    let component = this;
    window.jQuery('.d3-value-arc text').popover({
      placement: 'top',
      html: true,
      container: 'body',
      trigger: 'hover',
      content: function(){
        let category = window.jQuery(this)
          .closest('.d3-value-arc')
          .attr('class').split(' ')[1];
        return component.popoverContentForCategory(category)
      }

    });
  }

  /*
   * Summary
   */

   get category_keys(){
    let graphs = this,
      keys;
    switch (graphs.current_route_name){
      case 'Travel':
        keys = ['result_transport_total'];
        break;
      case 'Home':
        keys = ['result_housing_total'];
        break;
      case 'Food':
        keys = ['result_food_total'];
        break;
      case 'Shopping':
        keys = ['result_goods_total', 'result_services_total'];
        break;
      default:
        keys = ['result_grand_total'];
    }
    return keys;
   }

  get user_category_footprint(){
    let graphs = this;
    if (graphs.current_route_name === 'TakeAction'){
      return graphs.userApiValue('result_grand_total') - graphs.displayTakeactionSavings('result_takeaction_pounds');
    } else if (graphs.current_route_name === 'GetStarted'){
      return graphs.userApiValue('result_grand_total');
    } else {
      return graphs.category_keys.reduce((sum, category_key)=>{
        return sum + parseFloat(graphs.userApiValue(category_key));
      }, 0)
    }
  }

  get average_category_footprint(){
    let graphs = this;

    return graphs.category_keys.reduce((sum, category_key)=>{
      return sum + parseFloat(graphs.defaultApiValue(category_key));
    }, 0);
  }

  get display_category_percent(){
    let graphs = this;
    if (graphs.state_manager.footprint_not_updated){
      return 0;
    } else {
      return Math.round(Math.abs(
        100 * graphs.user_category_footprint / graphs.average_category_footprint - 100
      ));
    }
  }

  get category_percentage_byline(){
    let graphs = this;
    if (graphs.worse_than_average){
      return graphs.t('graphs.worse_than_average');
    } else {
      return graphs.t('graphs.better_than_average');
    }
  }

  get worse_than_average(){
    return Math.round(this.user_category_footprint) > Math.round(this.average_category_footprint);
  }

  get category_user_byline(){
    let graphs = this;
    switch (graphs.current_route_name){
      case 'Travel':
        return graphs.t('summaries.total_travel_footprint')
      case 'Home':
        return graphs.t('summaries.total_home_footprint')
      case 'Food':
        return graphs.t('summaries.total_food_footprint')
      case 'Shopping':
        return graphs.t('summaries.total_shopping_footprint')
      default:
        return graphs.t('summaries.total_footprint')
    }
  }

  get category_average_byline(){
    let graphs = this;
    switch (graphs.current_route_name){
      case 'Travel':
        return graphs.t('summaries.average_travel_footprint')
      case 'Home':
        return graphs.t('summaries.average_home_footprint')
      case 'Food':
        return graphs.t('summaries.average_food_footprint')
      case 'Shopping':
        return graphs.t('summaries.average_shopping_footprint')
      default:
        return graphs.t('summaries.average_footprint')
    }
  }

  get display_total_footprint(){
    let graphs = this;
    return Math.round(graphs.userApiValue('result_grand_total'))
  }

}

GraphsComponent.propTypes = {};

GraphsComponent.NAME = 'Graphs';

module.exports = GraphsComponent;
