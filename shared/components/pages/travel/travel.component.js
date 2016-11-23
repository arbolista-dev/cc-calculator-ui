/* global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import Vehicle from './vehicle';
import template from './travel.rt.html';


const RELEVANT_API_KEYS = ['publictrans', 'bus', 'transit', 'commuter', 'intercity',
  'airtotal', 'airshort', 'airmedium', 'airlong', 'airextended'];
const KILOMETERS_PER_MILE = 1.609344;
const LITERS_PER_GALLON = 3.785411784;

class TravelComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const travel = this;
    travel.initResizeListener();
    travel.state = Object.assign({
      simple: true,
      consumption_unit: 'mpg',
      vehicles: travel.createVehicles(),
    }, travel.userApiState());
  }

  componentDidMount() {
    const travel = this;
    travel.vehicles.forEach((vehicle) => {
      vehicle.initializeMpgSlider();
    });
  }

  render() {
    return template.call(this);
  }

  get vehicles() {
    return this.state.vehicles;
  }

  get number_of_vehicles() {
    return parseInt(this.userApiValue('input_footprint_transportation_num_vehicles'), 10);
  }

  get vehicles_maxed() {
    return this.vehicles.length === 10;
  }

  get api_key_base() {
    return 'input_footprint_transportation';
  }

  get relevant_api_keys() {
    return RELEVANT_API_KEYS;
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
    const travel = this;
    if (travel.simple) return;
    travel.setState({
      simple: true,
    });
    travel.updateFootprintParams({
      input_footprint_transportation_groundtype: 0,
      input_footprint_transportation_airtype: 0,
    });
  }

  setAdvanced() {
    const travel = this;
    if (travel.advanced) return;
    travel.setState({
      simple: false,
    });
    travel.updateFootprintParams({
      input_footprint_transportation_groundtype: 1,
      input_footprint_transportation_airtype: 1,
    });
  }

  /*
   * Vehicle Updates
   */

  createVehicles() {
    const travel = this;
    const garage = [];

    for (let i = 1; i <= travel.number_of_vehicles; i += 1) {
      garage.push(new Vehicle(travel.newVehicleParams(i), travel, 'mpg'));
    }
    return garage;
  }

  newVehicleParams(n) {
    const travel = this;
    return {
      miles: travel.userApiValue(`input_footprint_transportation_miles${n}`),
      mpg: travel.userApiValue(`input_footprint_transportation_mpg${n}`),
      fuel_type: travel.userApiValue(`input_footprint_transportation_fuel${n}`),
    };
  }

  updateVehicleFootprint() {
    const travel = this;
    const vehicle_params = {
      input_footprint_transportation_num_vehicles: travel.vehicles.length,
    };
    for (let i = 1; i <= 10; i += 1) {
      const vehicle = travel.vehicles[i - 1];
      if (vehicle) {
        Object.assign(vehicle_params, vehicle.cc_inputs(i));
        if (travel.state.consumption_unit === 'kml') {
          const curr_distance = vehicle_params[`input_footprint_transportation_miles${i}`];
          const consumption = vehicle_params[`input_footprint_transportation_mpg${i}`];
          vehicle_params[`input_footprint_transportation_miles${i}`] = travel.convertKmToMiles(curr_distance);
          vehicle_params[`input_footprint_transportation_mpg${i}`] = travel.convertMetricConsumptionToMPG(consumption);
        }
      } else {
        vehicle_params[`input_footprint_transportation_miles${i}`] = 0;
      }
    }
    travel.setState({ vehicles: travel.state.vehicles });
    travel.updateFootprint(vehicle_params);
  }

  // vehicle input changed.
  updateVehicle(vehicle, e) {
    const travel = this;
    const updated = vehicle;
    const key = e.target.dataset.key;
    const value = e.target.value;
    updated[key] = value;
    travel.updateVehicleFootprint();
  }
  // vehicle input changed.
  updateVehicleFuelType(vehicle, fuel_type) {
    const travel = this;
    const updated = vehicle;
    updated.fuel_type = fuel_type;
    travel.updateVehicleFootprint();
  }

  displayFuelType(vehicle) {
    if (vehicle.fuel_type === '1') return this.t('travel.gasoline');
    return this.t('travel.diesel');
  }

  addVehicle() {
    const travel = this;
    if (travel.vehicles_maxed) return;
    const params = travel.newVehicleParams(travel.vehicles.length + 1);
    const new_vehicle = new Vehicle(params, travel, travel.state.consumption_unit);
    travel.vehicles.push(new_vehicle);
    travel.setState({
      vehicles: this.vehicles,
    }, () => {
      new_vehicle.initializeMpgSlider();
    });
    travel.updateVehicleFootprint();
  }

  removeVehicle(vehicle) {
    const travel = this;
    const vehicle_index = travel.vehicles.indexOf(vehicle);
    travel.vehicles.splice(vehicle_index, 1);
    travel.setState({
      vehicles: this.vehicles,
    });
    travel.updateVehicleFootprint();
  }

  /*
  * Gasoline consumption unit
  */
  updateConsumptionUnit(new_unit, event) {
    event.preventDefault();
    const travel = this;
    if (new_unit !== this.state.consumption_unit) {
      travel.state.vehicles.forEach((v) => {
        const vehicle = v;
        if (new_unit === 'mpg') {
          vehicle.mpg = travel.convertMetricConsumptionToMPG(vehicle.mpg);
        } else {
          vehicle.mpg = travel.convertMPGToMetric(vehicle.mpg);
        }
        vehicle.consumption_unit = new_unit;
        vehicle.updateConsumptionSlider();
      });
      travel.setState({
        consumption_unit: new_unit,
      });
    }
  }

  displayConsumptionUnit() {
    const travel = this;
    if (travel.state.consumption_unit === 'mpg') return this.t('travel.miles_per_gallon');
    return this.t('travel.liters_per_km');
  }

  displayYearlyDistanceUnit() {
    const travel = this;
    if (travel.state.consumption_unit === 'mpg') return this.t('travel.miles_per_year');
    return this.t('travel.km_per_year');
  }

  displayDistanceAbbreviation() {
    const travel = this;
    if (travel.state.consumption_unit === 'mpg') return ` ${this.t('travel.miles_abbr')})`;
    return ` ${this.t('travel.km_abbr')})`;
  }

  convertKmToMiles(km) {
    return Math.round(km / KILOMETERS_PER_MILE).toString();
  }

  convertMilesToKm(miles) {
    return Math.round(miles * KILOMETERS_PER_MILE).toString();
  }

  convertMPGToMetric(mpg) {
    const val = LITERS_PER_GALLON / mpg / (KILOMETERS_PER_MILE * 100);
    return Math.round(val);
  }

  convertMetricConsumptionToMPG(metricConsumption) {
    const val = (100 * LITERS_PER_GALLON) / (KILOMETERS_PER_MILE * metricConsumption);
    return Math.round(val);
  }

  displayDistanceValue(api_suffix) {
    const travel = this;
    const api_value = travel.displayUserApiStateValue(api_suffix);
    if (travel.state.consumption_unit === 'mpg') {
      return Math.round(api_value);
    }
    return travel.convertMilesToKm(api_value);
  }

  updateDistanceFootprint(event) {
    const travel = this;
    const api_key = event.target.dataset.api_key;
    const update = {};

    if (travel.state.consumption_unit === 'mpg') {
      update[api_key] = event.target.value;
    } else {
      update[api_key] = travel.convertKmToMiles(event.target.value);
    }
    travel.setState(update);
    travel.updateFootprint(update);
  }

  resize() {
    const travel = this;
    travel.vehicles.forEach((vehicle) => {
      vehicle.slider.redraw({
        outer_width: travel.slider_width,
      });
    });
  }
}

TravelComponent.NAME = 'Travel';
TravelComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(TravelComponent);
