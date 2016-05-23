/*global module*/

import React from 'react';

import Panel from './../../lib/base_classes/panel';
import template from './travel.rt.html';
import Vehicle from './vehicle';


const RELEVANT_API_KEYS = ['publictrans', 'bus', 'transit', 'commuter', 'intercity',
    'airtotal', 'airshort', 'airmedium', 'airlong', 'airextended'];

class TravelComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let travel = this;
    travel.state = Object.assign({
      simple: true,
      vehicles: [
        new Vehicle({}, travel),
        new Vehicle({}, travel)
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
    console.log(this.state)
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
    travel.setState({vehiles: travel.state.vehicles});
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
