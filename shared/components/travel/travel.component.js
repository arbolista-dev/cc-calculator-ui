/*global module*/

import React from 'react';

import Panel from './../../lib/base_classes/panel';
import template from './travel.rt.html';
import Vehicle from './vehicle';

class TravelComponent extends Panel {

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
  }

  get vehicles(){
    return this.state.vehicles;
  }

  get vehicles_maxed(){
    return this.vehicles.length === 10;
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

}

TravelComponent.propTypes = {};

TravelComponent.NAME = 'Travel';

module.exports = TravelComponent;
