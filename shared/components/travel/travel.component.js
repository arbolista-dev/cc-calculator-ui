/*global module*/

import React from 'react';
import mixin from './../../lib/mixin';

import TranslatableComponent from '../translatable/translatable.component';
import {footprint} from './../../lib/mixins/components/footprint';
import template from './travel.rt.html';
import Vehicle from './vehicle';

class TravelComponent extends mixin(TranslatableComponent, footprint) {

  constructor(props, context){
    super(props, context);
    let travel = this;
    travel.state = {
      simple: true,
      vehicles: [
        new Vehicle({}, travel),
        new Vehicle({}, travel)
      ]
    }
    travel.state_manager.updateFootprintParams({
      input_footprint_transportation_groundtype: 0,
      input_footprint_transportation_airtype: 0
    });
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get router(){
    return this.props.router
  }

  get vehicles(){
    return this.state.vehicles;
  }

  get vehicles_maxed(){
    return this.vehicles.length === 10;
  }

  componentDidMount(){
    let travel = this;
    travel.vehicles.forEach((vehicle)=>{
      vehicle.initializeMpgSlider();
    });
  }

  /*
   * Simple/Advanced
   */

  get simple(){
    return this.state.simple;
  }

  setSimple(){
    let travel = this;
    travel.setState({
      simple: true
    });
    travel.state_manager.updateFootprintParams({
      input_footprint_transportation_groundtype: 0,
      input_footprint_transportation_airtype: 0
    });
  }

  setAdvanced(){
    let travel = this;
    travel.setState({
      simple: false
    });
    travel.state_manager.updateFootprintParams({
      input_footprint_transportation_groundtype: 1,
      input_footprint_transportation_airtype: 1
    })
  }

  /*
   * Vehicle Updates
   */

  updateVehicleFootprint(){
    let travel = this,
        vehicle_params = {
          input_footprint_transportation_num_vehicles: travel.vehicles.length
        };
    for (let i=1; i<=10; i++){
      let vehicle = travel.vehicles[i- 1];
      if (vehicle){
        Object.assign(vehicle_params, vehicle.cc_inputs(i));
      } else {
        vehicle_params[`input_footprint_transportation_miles${i}`] = 0;
      }
    }
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

  addVehicle(){
    let travel = this;
    if (travel.vehicles_maxed) return false;
    let new_vehicle = new Vehicle({}, travel);
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

  render(){
    return template.call(this);
  }

}

TravelComponent.propTypes = {

};

TravelComponent.NAME = 'Travel';

module.exports = TravelComponent;
