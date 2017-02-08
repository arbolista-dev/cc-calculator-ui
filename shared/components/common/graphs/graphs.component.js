/* global module window setTimeout document */

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import OverlapBar from 'd3-object-charts/src/bar/overlap';
import ComparativePie from 'd3-object-charts/src/pie/comparative';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './graphs.rt.html';

const CATEGORIES = ['result_transport_total', 'result_housing_total',
  'result_food_total', 'result_goods_total', 'result_services_total'];
const MIN_GRAPH_WIDTH = 250;
const MAX_GRAPH_WIDTH = 800;

class GraphsComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const graphs = this;
    graphs.state = {
      show_chart: true,
      chart_type: 'bar',
    };
    graphs.initResizeListener();
  }

  componentDidMount() {
    const graphs = this;
    if (window.innerWidth < 992) {
      graphs.setState({
        show_chart: false,
      });
    }
    if (graphs.show_pie_chart) {
      graphs.drawPieChart();
    } else if (graphs.show_bar_chart) {
      graphs.initializeOverallBarChart();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.average_footprint.get('loading') && !nextProps.user_footprint.get('loading');
  }

  componentDidUpdate() {
    const graphs = this;
    if (graphs.show_pie_chart) {
      graphs.drawPieChart();
    } else if (graphs.show_bar_chart) {
      graphs.initializeOverallBarChart();
    }
    graphs.hidePopovers();
  }

  componentWillUnmount() {
    this.hidePopovers();
  }

  render() {
    return template.call(this);
  }

  get show_chart() {
    return this.state.show_chart;
  }

  get show_pie_chart() {
    return this.show_chart &&
      this.state.chart_type === 'pie';
  }

  get show_bar_chart() {
    return this.show_chart &&
      this.state.chart_type === 'bar';
  }

  get categories() {
    const graphs = this;
    return CATEGORIES.map(category_key => graphs.t(`categories.${category_key}`));
  }

  get category_colors() {
    const graphs = this;
    const color_coding = {};
    return CATEGORIES.reduce((hash, category_key) => {
      const translated = graphs.t(`categories.${category_key}`);
      color_coding[translated] = graphs.state_manager.category_colors[category_key];
      return color_coding;
    }, {});
  }

  get user_profile_footprint() {
    return this.props.user_profile_footprint ? this.props.user_profile_footprint : {};
  }

  get user_footprint() {
    return (Object.keys(this.user_profile_footprint).length !== 0) ? this.user_profile_footprint : this.props.user_footprint.get('data').toJS();
  }

  get average_footprint() {
    return this.props.average_footprint.get('data').toJS();
  }

  get average_footprint_total() {
    return this.defaultApiValue('result_grand_total');
  }

  get displayCompactSummary() {
    return (this.current_route_name === 'Footprint' || this.current_route_name === 'Profile');
  }

  get shouldShowTotal() {
    return !(this.current_route_name === 'GetStarted' || this.current_route_name === 'Footprint' || this.current_route_name === 'TakeAction' || this.current_route_name === 'Profile');
  }

  toggleChart() {
    const graphs = this;
    graphs.setState({
      show_chart: !graphs.state.show_chart,
      chart_type: 'bar',
    });
  }

  toggleChartType(type) {
    this.hidePopovers();
    if (this.state.chart_type === type) {
      this.setState({
        show_chart: false,
        chart_type: undefined,
      });
    } else {
      this.setState({
        show_chart: true,
        chart_type: type,
      });
    }

    setTimeout(() => {
      if (this.show_pie_chart) {
        this.drawPieChart();
      } else if (this.show_bar_chart) {
        this.initializeOverallBarChart();
      }
      window.jQuery('html, body').animate({ scrollTop: window.jQuery(document).height() }, 1000);
    }, 400);
  }

  hidePopovers() {
    window.jQuery('.popover').remove();
  }

  generateData(footprint) {
    return CATEGORIES.map(category => footprint[category]);
  }

  resize() {
    const graphs = this;
    graphs.bar_chart.redraw(graphs.graph_dimensions);
    if (graphs.pie_chart) {
      graphs.pie_chart.redraw(graphs.graph_dimensions);
    }
  }

  get graph_dimensions() {
    const width = document.getElementById('graphs').offsetWidth;
    const dimensions = {
      outer_width: width * 0.8,
    };
    dimensions.outer_width = Math.max(
      MIN_GRAPH_WIDTH,
      dimensions.outer_width,
    );
    dimensions.outer_width = Math.min(
      MAX_GRAPH_WIDTH,
      dimensions.outer_width,
    );
    dimensions.outer_height = Math.max(300, dimensions.outer_width / 2);
    return dimensions;
  }

  /*
   * Bar Chart
   */

  initializeOverallBarChart() {
    const graphs = this;
    const dimensions = graphs.graph_dimensions;
    document.getElementById('overview_bar_chart').innerHTML = '';
    graphs.bar_chart = new OverlapBar({
      outer_height: dimensions.outer_height,
      outer_width: dimensions.outer_width,
      container: '#overview_bar_chart',
      y_ticks: 5,
      margin: { top: 4, bottom: 30, left: 40, right: 0 },
      seriesClass: series => series.name.replace(/\s+/g, '-').toLowerCase(),
    });
    graphs.drawBarData();
  }

  drawBarData() {
    const graphs = this;
    graphs.bar_chart.drawData({
      categories: graphs.categories,
      series: [
        {
          name: graphs.t('graphs.your_footprint'),
          values: graphs.generateData(graphs.user_footprint),
        }, {
          name: graphs.t('graphs.average_footprint'),
          values: graphs.generateData(graphs.average_footprint),
        },
      ],
    });
    graphs.initializeBarPopovers();
  }

  initializeBarPopovers() {
    const component = this;
    window.jQuery('.your-footprint').popover({
      placement: 'top',
      html: true,
      container: 'body',
      trigger: 'hover',
      content() {
        const klasses = window.jQuery(this).attr('class').split(' ');
        const category = klasses[klasses.length - 1];
        return component.popoverContentForCategory(category);
      },

    });
  }

  /*
   * Pie Chart
   */

  get pie_margins() {
    return {
      top: 30,
      left: 50,
      right: 50,
      bottom: 30,
    };
  }

  // Don't redraw pie data. The average and user values
  // will be drawn out of order, hiding smaller value.
  // Instead, wipe the chart and completely redraw.
  drawPieChart() {
    const component = this;
    const colors = component.category_colors;
    const dimensions = component.graph_dimensions;
    document.getElementById('overall_comparative_pie').innerHTML = '';
    component.pie_chart = new ComparativePie({
      container: '#overall_comparative_pie',
      outer_width: dimensions.outer_width,
      outer_height: dimensions.outer_height,
      margin: component.pie_margins,
      label_r: 30,
      fnColor: category => colors[category],
    });
    component.pie_chart.drawData({
      categories: component.categories,
      values: component.generateData(component.user_footprint),
      comparative_sum: component.average_footprint_total,
    });
    component.initializePiePopovers();
  }

  initializePiePopovers() {
    const component = this;
    window.jQuery('.d3-value-arc text').popover({
      placement: 'top',
      html: true,
      container: 'body',
      trigger: 'hover',
      content() {
        const category = window.jQuery(this)
          .closest('.d3-value-arc')
          .attr('class').split(' ')[1];
        return component.popoverContentForCategory(category);
      },
    });
  }

  /*
   * Summary
   */

  get category_keys() {
    const graphs = this;
    let keys;
    switch (graphs.current_route_name) {
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

  get user_category_footprint() {
    const graphs = this;
    if (graphs.current_route_name === 'TakeAction') {
      return graphs.userApiValue('result_takeaction_grand_total');
    } else if (graphs.current_route_name === 'GetStarted') {
      return graphs.userApiValue('result_grand_total');
    } else if (graphs.current_route_name === 'Profile') {
      return graphs.user_footprint.result_grand_total;
    }
    return graphs.category_keys.reduce((sum, category_key) =>
      sum + parseFloat(graphs.userApiValue(category_key)), 0);
  }

  get average_category_footprint() {
    const graphs = this;
    return graphs.category_keys.reduce((sum, category_key) =>
    sum + parseFloat(graphs.defaultApiValue(category_key)), 0);
  }

  get display_category_percent() {
    const graphs = this;
    return Math.round(Math.abs(
      ((100 * graphs.user_category_footprint) / graphs.average_category_footprint) - 100,
    ));
  }

  get category_percentage_byline() {
    const graphs = this;
    if (graphs.worse_than_average) {
      return graphs.t('graphs.worse_than_average');
    }
    return graphs.t('graphs.better_than_average');
  }

  get worse_than_average() {
    return Math.round(this.user_category_footprint) > Math.round(this.average_category_footprint);
  }

  get category_user_byline() {
    const graphs = this;
    switch (graphs.current_route_name) {
      case 'GetStarted':
        return graphs.t('summaries.total_get_started_footprint');
      case 'Travel':
        return graphs.t('summaries.total_travel_footprint');
      case 'Home':
        return graphs.t('summaries.total_home_footprint');
      case 'Food':
        return graphs.t('summaries.total_food_footprint');
      case 'Shopping':
        return graphs.t('summaries.total_shopping_footprint');
      default:
        return graphs.t('summaries.total_footprint');
    }
  }

  get category_average_byline() {
    const graphs = this;
    switch (graphs.current_route_name) {
      case 'Travel':
        return graphs.t('summaries.average_travel_footprint');
      case 'Home':
        return graphs.t('summaries.average_home_footprint');
      case 'Food':
        return graphs.t('summaries.average_food_footprint');
      case 'Shopping':
        return graphs.t('summaries.average_shopping_footprint');
      default:
        return graphs.t('summaries.average_footprint');
    }
  }

  get your_footprint_legend() {
    const graphs = this;
    return (graphs.current_route_name === 'Profile') ? graphs.t('graphs.this_household') : graphs.t('footprint.your_footprint');
  }

  get display_total_footprint() {
    const graphs = this;
    return Math.round(graphs.userApiValue('result_grand_total'));
  }

}
GraphsComponent.propTypes = footprintPropTypes;
GraphsComponent.NAME = 'Graphs';

module.exports = footprintContainer(GraphsComponent);
