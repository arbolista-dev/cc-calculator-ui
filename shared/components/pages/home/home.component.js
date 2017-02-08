/* global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';
import SnapSlider from 'd3-object-charts/src/slider/snap_slider';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './home.rt.html';

const RELEVANT_API_KEYS = [
  'watersewage', 'cleanpercent', 'squarefeet',
  'electricity_dollars', 'electricity_kwh', 'electricity_type',
  'naturalgas_dollars', 'naturalgas_therms', 'naturalgas_cuft', 'naturalgas_type',
  'heatingoil_dollars', 'heatingoil_gallons', 'heatingoil_type',
];

class HomeComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const home = this;
    home.initResizeListener();
    home.state = home.userApiState();
  }

  componentDidMount() {
    const home = this;
    home.initializeWaterSlider();
    home.initializeCleanPercentSlider();
  }

  render() {
    return template.call(this);
  }

  get display_electricity_units() {
    if (this.unitsSet('electricity', 0)) return this.t('units.usd_per_year');
    return this.t('units.kwh_per_year');
  }
  get display_naturalgas_units() {
    if (this.unitsSet('naturalgas', 0)) return this.t('units.usd_per_year');
    else if (this.unitsSet('naturalgas', 1)) return this.t('units.therms_per_year');
    return this.t('units.cuft_per_year');
  }
  get display_heatingoil_units() {
    if (this.unitsSet('heatingoil', 0)) return this.t('units.usd_per_year');
    return this.t('units.gallons_per_year');
  }

  get api_key_base() {
    return 'input_footprint_housing';
  }

  get display_cleanpercent() {
    return Math.round(this.state[this.apiKey('cleanpercent')]);
  }

  get display_annual_water_dollars() {
    return Math.round(this.state.input_footprint_housing_watersewage);
  }

  get relevant_api_keys() {
    return RELEVANT_API_KEYS;
  }

  displayRoundedValues(value) {
    return Math.round(value);
  }

  userCategoryInput(key_end) {
    const home = this;
    return home.userApiValue(home.apiKey(key_end));
  }

  defaultCategoryInput(key_end) {
    const home = this;
    return Math.round(parseInt(home.defaultApiValue(home.apiKey(key_end)), 10));
  }

  /*
   * Toggling Units
   */

  unitsSet(category, value) {
    const home = this;
    const api_key = home.apiKey(`${category}_type`);
    const set_value = home.userApiValue(api_key);
    return parseInt(set_value, 10) === parseInt(value, 10);
  }

  setUnits(e) {
    e.preventDefault();
    const home = this;
    const api_key = e.target.dataset.api_key;
    const update = { [api_key]: e.target.dataset.value };
    home.updateFootprintParams(update);
    home.setState(update);
  }

  /*
   * Water Slider
   */

  initializeWaterSlider() {
    const home = this;
    const watersewage_api_key = home.apiKey('watersewage');
    const default_watersewage = home.defaultApiValue(watersewage_api_key);

    home.water_slider = new SimpleSlider({
      container: '#home_watersewage_slider',
      outer_width: home.slider_width,
      handle_r: 16,
      tick_labels: {
        0: '0',
        1: '1x',
        2: '2x',
        3: '3x',
        4: '4x',
        5: '5x',
      },
      axis_click_handle: true,
      onChange: (multiplier) => {
        const update = {
          [watersewage_api_key]: multiplier * parseFloat(default_watersewage),
        };
        home.setState(update);
        home.updateFootprint(update);
      },
    });
    home.water_slider.drawData({
      abs_min: 0,
      abs_max: 5,
      current_value: home.userApiValue(watersewage_api_key) / default_watersewage,
    });
  }

  resize() {
    this.water_slider.redraw({
      outer_width: this.slider_width,
    });
    this.cleanpercent_slider.redraw({
      outer_width: this.slider_width,
    });
  }

  initializeCleanPercentSlider() {
    const home = this;
    const cleanpercent_api_key = home.apiKey('cleanpercent');

    home.cleanpercent_slider = new SnapSlider({
      container: '#home_cleanpercent_slider',
      tick_values: [0, 20, 40, 60, 80, 100],
      outer_width: home.slider_width,
      handle_r: 16,
      axis_click_handle: true,
      onSnap: (cleanpercent) => {
        const api_key = home.apiKey('cleanpercent');
        const update = {
          [api_key]: cleanpercent,
        };

        home.setState(update);
        home.updateFootprint(update);
      },
    });
    home.cleanpercent_slider.drawData({
      abs_min: 0,
      abs_max: 100,
      current_value: home.userApiValue(cleanpercent_api_key),
    });
  }

}

HomeComponent.propTypes = footprintPropTypes;
HomeComponent.NAME = 'Home';

module.exports = footprintContainer(HomeComponent);
