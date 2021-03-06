/* global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';
import { upperFirst as _upperFirst } from 'lodash';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './shopping.rt.html';

// We are ignoring goods_other_total - if advanced selected,
// user must answer advanced other good questions.
const GOODS_QUESTIONS = [
  'furnitureappliances', 'clothing',
  'other_entertainment', 'other_office', 'other_personalcare',
  'other_autoparts', 'other_medical',
];
const SERVICES_QUESTIONS = [
  'healthcare', 'education', 'communications',
  'vehicleservices', 'finance', 'household', 'charity', 'miscservices',
];


class ShoppingComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const shopping = this;

    shopping.state = Object.assign({
      simple: true,
    }, shopping.userApiState());
    shopping.state.input_footprint_shopping_goods_total = shopping.userApiValue('input_footprint_shopping_goods_total');
    shopping.state.input_footprint_shopping_services_total = shopping.userApiValue('input_footprint_shopping_services_total');
    shopping.initResizeListener();
  }

  componentDidMount() {
    const shopping = this;
    shopping.initializeGoodsSlider();
    shopping.initializeServicesSlider();
  }

  render() {
    return template.call(this);
  }

  get api_key_base() {
    return 'input_footprint_shopping';
  }

  get relevant_api_keys() {
    return GOODS_QUESTIONS.concat(SERVICES_QUESTIONS);
  }

  get goods_questions() {
    return GOODS_QUESTIONS;
  }

  get average_goods_expend() {
    return this.defaultApiValue('input_footprint_shopping_goods_total');
  }

  get services_questions() {
    return SERVICES_QUESTIONS;
  }

  get average_services_expend() {
    return this.defaultApiValue('input_footprint_shopping_services_total');
  }

  getAdvancedLabel(type) {
    return this.t(`shopping.${type}.label`);
  }

  // overriding footprintable method.
  apiKey(type) {
    if (GOODS_QUESTIONS.indexOf(type) >= 0) {
      return `input_footprint_shopping_goods_${type}`;
    }
    return `input_footprint_shopping_services_${type}`;
  }

  /*
   * Callbacks
   */

  updateMonthlyExpenditure(event) {
    const shopping = this;
    const api_key = event.target.dataset.api_key;
    shopping.setState({ [api_key]: event.target.value });
    shopping.updateFootprint({ [api_key]: event.target.value });
  }

  /*
   * Simple/Advanced
   */

  get simple() {
    return this.state.simple;
  }

  get advanced() {
    return !this.state.simple;
  }

  setSimple() {
    const shopping = this;
    if (shopping.simple) return;
    shopping.setState({
      simple: true,
    });
    shopping.updateFootprintParams({
      input_footprint_shopping_goods_type: 0,
      input_footprint_shopping_goods_other_type: 1,
      input_footprint_shopping_services_type: 0,
    });
  }

  setAdvanced() {
    const shopping = this;
    if (shopping.advanced) return;
    shopping.setState({
      simple: false,
    });
    shopping.updateFootprintParams({
      input_footprint_shopping_goods_type: 1,
      input_footprint_shopping_goods_other_type: 1,
      input_footprint_shopping_services_type: 1,
    });
  }

  /*
   * Sliders
   */

  expendAverage(type) {
    const shopping = this;
    const api_key = shopping.apiKey(type);
    return shopping.defaultApiValue(api_key);
  }

  get display_services_monthly_spending() {
    return this.numberWithCommas(
      Math.round(this.state.input_footprint_shopping_services_total),
    );
  }

  initializeServicesSlider() {
    const shopping = this;
    const total_services_api_key = 'input_footprint_shopping_services_total';

    shopping.services_slider = new SimpleSlider({
      container: '#shopping_services_slider',
      outer_height: 60,
      outer_width: shopping.slider_width,
      margin: { left: 10, right: 15, top: 0, bottom: 10 },
      tick_labels: {
        0: '0',
        1: _upperFirst(shopping.t('average')),
        2: '2x',
        3: '3x',
        4: '4x',
        5: '5x',
      },
      axis_click_handle: true,
      onChange: (multiplier) => {
        const services_distribution = {};
        const update_params = SERVICES_QUESTIONS.reduce((hash, service_type) => {
          const api_key = shopping.apiKey(service_type);
          const new_value = multiplier * shopping.expendAverage(service_type);
          services_distribution[api_key] = new_value;
          return services_distribution;
        }, {});
        const total_services = multiplier * shopping.average_services_expend;

        update_params[total_services_api_key] = total_services;
        shopping.setState(update_params);
        shopping.updateFootprint(update_params);
      },
    });
    shopping.services_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: shopping.userApiValue(total_services_api_key) /
      shopping.average_services_expend,
    });
  }

  get display_goods_monthly_spending() {
    return this.numberWithCommas(
      Math.round(this.state.input_footprint_shopping_goods_total),
    );
  }

  initializeGoodsSlider() {
    const shopping = this;
    const total_goods_api_key = 'input_footprint_shopping_goods_total';

    shopping.goods_slider = new SimpleSlider({
      container: '#shopping_goods_slider',
      outer_height: 60,
      outer_width: shopping.slider_width,
      margin: { left: 10, right: 15, top: 0, bottom: 10 },
      tick_labels: {
        0: '0',
        1: _upperFirst(shopping.t('average')),
        2: '2x',
        3: '3x',
        4: '4x',
        5: '5x',
      },
      axis_click_handle: true,
      onChange: (multiplier) => {
        const goods_state = {};
        const services_distribution = {};
        const update_params = GOODS_QUESTIONS.reduce((hash, goods_type) => {
          const api_key = shopping.apiKey(goods_type);
          const new_value = multiplier * shopping.expendAverage(goods_type);
          goods_state[goods_type] = new_value;
          services_distribution[api_key] = new_value;
          return services_distribution;
        }, {});

        const total_goods = multiplier * shopping.average_goods_expend;
        update_params[total_goods_api_key] = total_goods;

        shopping.setState(update_params);
        shopping.updateFootprint(update_params);
      },
    });
    shopping.goods_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: shopping.userApiValue(total_goods_api_key) / shopping.average_goods_expend,
    });
  }

  resize() {
    const shopping = this;
    shopping.goods_slider.redraw({
      outer_width: shopping.slider_width,
    });
    shopping.services_slider.redraw({
      outer_width: shopping.slider_width,
    });
  }

}

ShoppingComponent.propTypes = footprintPropTypes;
ShoppingComponent.NAME = 'Shopping';

module.exports = footprintContainer(ShoppingComponent);
