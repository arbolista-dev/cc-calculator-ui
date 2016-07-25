/*global module*/

import React from 'react';

import Panel from './../../lib/base_classes/panel';
import template from './travel.rt.html';
import Vehicle from './vehicle';


const RELEVANT_API_KEYS = ['publictrans', 'bus', 'transit', 'commuter', 'intercity',
    'airtotal', 'airshort', 'airmedium', 'airlong', 'airextended'],
    KILOMETERS_PER_MILE = 1.609344,
    LITERS_PER_GALLON = 3.785411784;

class TravelComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let travel = this;
    travel.initResizeListener();
    travel.state = Object.assign({
      simple: true,
      consumption_unit: 'mpg',
      vehicles: [
        new Vehicle(travel.newVehicleParams(1), travel),
        new Vehicle(travel.newVehicleParams(2), travel)
      ]
    }, travel.userApiState());
  }

  get vehicles(){
    return this.state.vehicles;
  }

  get vehicles_maxed(){
    return this.vehicles.length === 10;
  }

  get api_key_base(){
    return 'input_footprint_transportation';
  }

  get relevant_api_keys(){
    return RELEVANT_API_KEYS;
  }

  /*
   * React Events
   */

  componentDidMount(){
    let travel = this;
    travel.vehicles.forEach((vehicle)=>{
      vehicle.initializeMpgSlider();
    });
  }

  render(){
    return template.call(this);
  }

  /*
   * Simple/Advanced
   */

  get simple(){
    return this.state.simple;
  }

  get advanced(){
    return !this.state.simple;
  }

  setSimple(){
    let travel = this;
    if (travel.simple) return true;
    travel.setState({
      simple: true
    });
    travel.updateFootprintParams({
      input_footprint_transportation_groundtype: 0,
      input_footprint_transportation_airtype: 0
    });
  }

  setAdvanced(){
    let travel = this;
    if (travel.advanced) return true;
    travel.setState({
      simple: false
    });
    travel.updateFootprintParams({
      input_footprint_transportation_groundtype: 1,
      input_footprint_transportation_airtype: 1
    })
  }

  toggleLeadersChart() {
    let travel = this;
    travel.state_manager.state.show_leaders_chart = true;
    travel.state_manager.syncLayout();
    window.jQuery("html, body").animate({ scrollTop: window.jQuery(document).height() }, 1000);
  }

  /*
   * Vehicle Updates
   */

  newVehicleParams(n){
    let travel = this;
    return {
      miles: travel.userApiValue(`input_footprint_transportation_miles${n}`),
      mpg: travel.userApiValue(`input_footprint_transportation_mpg${n}`),
      fuel_type: travel.userApiValue(`input_footprint_transportation_fuel${n}`)
    }
  }

  updateVehicleFootprint(){
    let travel = this,
        vehicle_params = {
          input_footprint_transportation_num_vehicles: travel.vehicles.length
        };
    for (let i=1; i<=10; i++){
      let vehicle = travel.vehicles[i- 1];
      if (vehicle){
        Object.assign(vehicle_params, vehicle.cc_inputs(i));
        if (travel.state.consumption_unit === 'kml'){
          let curr_distance = vehicle_params[`input_footprint_transportation_miles${i}`],
              consumption = vehicle_params[`input_footprint_transportation_mpg${i}`];
          vehicle_params[`input_footprint_transportation_miles${i}`] = travel.convertKmToMiles(curr_distance);
          vehicle_params[`input_footprint_transportation_mpg${i}`] = travel.convertMetricConsumptionToMPG(consumption);
        }
      } else {
        vehicle_params[`input_footprint_transportation_miles${i}`] = 0;
      }
    }
    travel.setState({vehicles: travel.state.vehicles});
    travel.updateFootprint(vehicle_params);
  }

  // vehicle input changed.
  updateVehicle(vehicle, event){
    let travel = this,
        key = event.target.dataset.key,
        value = event.target.value;
    vehicle[key] = value;
    travel.updateVehicleFootprint();
  }
  // vehicle input changed.
  updateVehicleFuelType(vehicle, fuel_type){
    let travel = this;
    vehicle['fuel_type'] = fuel_type;
    travel.updateVehicleFootprint();
  }

  displayFuelType(vehicle){
    if (vehicle.fuel_type === '1') return this.t('travel.gasoline');
    else return this.t('travel.diesel');
  }

  addVehicle(){
    let travel = this;
    if (travel.vehicles_maxed) return false;
    let params = travel.newVehicleParams(travel.vehicles.length + 1),
        new_vehicle = new Vehicle(params, travel);
    travel.vehicles.push(new_vehicle);
    travel.setState({
      vehicles: this.vehicles
    }, ()=>{
      new_vehicle.initializeMpgSlider()
    });
    travel.updateVehicleFootprint();
  }

  removeVehicle(vehicle){
    let travel = this,
        vehicle_index = travel.vehicles.indexOf(vehicle);
    travel.vehicles.splice(vehicle_index, 1);
    travel.setState({
      vehicles: this.vehicles
    });
    travel.updateVehicleFootprint();
  }

  /*
  * Gasoline consumption unit
  */
  updateConsumptionUnit(new_unit, event){
    event.preventDefault();
    let travel = this;
    if (new_unit !== this.state.consumption_unit){
      travel.vehicles.forEach((vehicle)=>{
        if (new_unit === 'mpg'){
          vehicle.mpg = travel.convertMetricConsumptionToMPG(vehicle.mpg);
        } else {
          vehicle.mpg = travel.convertMPGToMetric(vehicle.mpg);
        }
        vehicle.updateConsumptionSlider();
      });
      travel.setState({
        consumption_unit: new_unit
      });
    }
  }

  displayConsumptionUnit(){
    let travel = this;
    if (travel.state.consumption_unit === 'mpg') return this.t('travel.miles_per_gallon');
    else return this.t('travel.liters_per_km');
  }

  displayYearlyDistanceUnit(){
    let travel = this;
    if (travel.state.consumption_unit === 'mpg') return this.t('travel.miles_per_year');
    else return this.t('travel.km_per_year');
  }

  displayDistanceAbbreviation(){
    let travel = this;
    if (travel.state.consumption_unit === 'mpg') return ' ' + this.t('travel.miles_abbr') + ')';
    else return ' ' + this.t('travel.km_abbr') + ')';
  }

  convertKmToMiles(km){
    return Math.round(km / KILOMETERS_PER_MILE).toString();
  }

  convertMilesToKm(miles){
    return Math.round(miles * KILOMETERS_PER_MILE).toString();
  }

  convertMPGToMetric(mpg){
    let val = LITERS_PER_GALLON / mpg / KILOMETERS_PER_MILE * 100;
    val = Math.round(val);
    return val;
  }

  convertMetricConsumptionToMPG(metricConsumption){
    let val = (100 * LITERS_PER_GALLON)/(KILOMETERS_PER_MILE * metricConsumption);
    val = Math.round(val);
    return val;
  }

  displayDistanceValue(api_suffix){
    let travel = this,
        api_value = travel.displayUserApiStateValue(api_suffix);
    if (travel.state.consumption_unit === 'mpg') {
      return Math.round(api_value);
    } else {
      api_value = travel.convertMilesToKm(api_value);
      return api_value;
    }
  }

  updateDistanceFootprint(event){
    let travel = this,
        api_key = event.target.dataset.api_key,
        update;

    if (travel.state.consumption_unit === 'mpg') {
      update = {
        [api_key]: event.target.value
      };
    } else {
      update = {
        [api_key]: travel.convertKmToMiles(event.target.value)
      };
    }
    travel.setState(update);
    travel.updateFootprint(update);
  }

  resize(){
    let travel = this;
    travel.vehicles.forEach((vehicle)=>{
      vehicle.slider.redraw({
        outer_width: travel.slider_width
      });
    });
  }

}

TravelComponent.propTypes = {};

TravelComponent.NAME = 'Travel';

module.exports = TravelComponent;
