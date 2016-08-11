/*global module*/

import React from 'react';

// import Action from './action';
import Panel from './../../lib/base_classes/panel';
import template from './take_action.rt.html'

const ACTION_CATEGORIES = [['transportation', 'Transportation'], ['housing', 'Housing'], ['shopping', 'Shopping']];
// export const ACTIONS_LIST = {"transportation": ['more_efficient_vehicle', 'alternativefuel_vehicle', 'electric_vehicle', 'hybrid_vehicle', 'telecommute_to_work', 'ride_my_bike', 'take_public_transportation', 'practice_eco_driving', 'maintain_my_vehicles', 'carpool_to_work', 'reduce_air_travel'], "shopping": ['low_carbon_diet', 'go_organic'],  "housing": ['switch_to_cfl', 'turn_off_lights', 'T12toT8', 'tankless_water_heater', 'thermostat_winter', 'thermostat_summer', 'purchase_high_efficiency_cooling', 'purchase_high_efficiency_heating', 'energy_star_fridge', 'energy_star_printers', 'energy_star_copiers', 'energy_star_desktops', 'rechargeable_batteries', 'power_mgmt_comp', 'purchase_green_electricity', 'install_PV_panels', 'install_solar_heating', 'low_flow_showerheads', 'low_flow_faucets', 'low_flow_toilet', 'line_dry_clothing', 'water_efficient_landscaping', 'plant_trees', 'reduce_comm_waste', 'print_double_sided']};
export const ACTIONS_LIST = [{
    "category": "transportation",
    "keys": ["more_efficient_vehicle", "alternativefuel_vehicle", "electric_vehicle", "hybrid_vehicle", "telecommute_to_work", "ride_my_bike", "take_public_transportation", "practice_eco_driving", "maintain_my_vehicles", "carpool_to_work", "reduce_air_travel"]
}, {
    "category": "shopping",
    "keys": ["low_carbon_diet", "go_organic"]
}, {
    "category": "housing",
    "keys": ["switch_to_cfl", "turn_off_lights", "T12toT8", "tankless_water_heater", "thermostat_winter", "thermostat_summer", "purchase_high_efficiency_cooling", "purchase_high_efficiency_heating", "energy_star_fridge", "energy_star_printers", "energy_star_copiers", "energy_star_desktops", "rechargeable_batteries", "power_mgmt_comp", "purchase_green_electricity", "install_PV_panels", "install_solar_heating", "low_flow_showerheads", "low_flow_faucets", "low_flow_toilet", "line_dry_clothing", "water_efficient_landscaping", "plant_trees", "reduce_comm_waste", "print_double_sided"]
}];

// 'offset_transportation', 'offset_housing', 'offset_shopping'

class TakeActionComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let take_action = this;
    take_action.action_keys = Object.keys(take_action.result_takeaction_pounds)
      .filter(key=> !/^offset_/.test(key));
    take_action.state = take_action.userApiState();
    take_action.state['input_action_category'] = ACTION_CATEGORIES[0][0];
    take_action.state['show_actions'] = ACTIONS_LIST[ACTION_CATEGORIES[0][0]];
    take_action.state['vehicles'] = take_action.vehicles;

    console.log('input_action_category: ', take_action.state['input_action_category'])
  }

  get vehicles(){
    let footprint = this.state_manager.state.user_footprint,
        num = footprint['input_footprint_transportation_num_vehicles'],
        vehicles = [];

    for (let i=1; i<=num; i++){
      let vehicle = {};
      vehicle.miles = footprint[`input_footprint_transportation_miles${i}`];
      vehicle.mpg = footprint[`input_footprint_transportation_mpg${i}`];
      vehicles.push(vehicle);
    }
    return vehicles;
  }

  get action_categories(){
    return ACTION_CATEGORIES;
  }

  get actions_list(){
    return ACTIONS_LIST;
  }

  get relevant_api_keys(){
    return this.action_keys;
  }

  get external_offset_set(){
    let e_o = this.state_manager.state.external_offset;
    return Object.keys(e_o).length !== 0 && e_o.constructor === Object
  }

  get result_takeaction_pounds(){
    return this.state_manager['result_takeaction_pounds'];
  }

  get result_takeaction_dollars(){
    return this.state_manager['result_takeaction_dollars'];
  }

  get result_takeaction_net10yr(){
    return this.state_manager['result_takeaction_net10yr'];
  }

  setSelectOptions(select) {
    if (select.type === 'vehicle') {

      let options = [], i = 1;
      this.vehicles.forEach((v) => {
        let vehicle = {};
        vehicle.value = i;
        vehicle.text = 'Vehicle ' + i;
        i++;
        options.push(vehicle);
      })
      return options;

    } else {
      return select.options
    }

  }

  isCategoryActive(category){
    return this.state.input_action_category === category;
  }

  setActiveActionsByCategory(category){
    let update = {};
    this.actions_list.forEach((group) => {
      if(category === group.category) {
        console.log('show Category: ',   group);
        update['show_actions'] = group.keys;
        this.setState(update);
      }
    })
  }


  setCategory(category){
    let take_action = this;
    take_action.setState({
      input_action_category: category
    });
    take_action.setActiveActionsByCategory(category);
  }

  showAction(key){
    let show =  this.state['show_actions'];
    if (show.includes(key)) {
      return true;
    } else {
      return false;
    }
  }

  updateTakeaction(params){
    let take_action = this;

    take_action.state_manager.update_in_progress = true;
    take_action.updateFootprintParams(params);

    // debounce updating take action results by 500ms.
    if (take_action.$update_takeaction) {
      clearTimeout(take_action.$update_takeaction);
    }

    take_action.$update_takeaction = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      take_action.state_manager.updateTakeactionResults()
        .then(()=> {
          take_action.state_manager.syncLayout();
        })
        .then(()=>{
          let user_api_state = take_action.userApiState();
          take_action.setState(user_api_state, ()=>{
            take_action.state_manager.update_in_progress = false;
          })
        });
    }, 500);
  }

  componentWillMount(){
    this.setActiveActionsByCategory(this.state['input_action_category']);
  }

  render(){
    return template.call(this);
  }

}

TakeActionComponent.NAME = 'TakeAction';

module.exports = TakeActionComponent;
