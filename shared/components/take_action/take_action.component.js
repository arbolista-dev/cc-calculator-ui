/*global module*/

import React from 'react';

import Action from './action';
import Panel from './../../lib/base_classes/panel';
import template from './take_action.rt.html'

const ACTION_CATEGORIES = [['transportation', 'Transportation'], ['housing', 'Housing'], ['shopping', 'Shopping']];
const ACTIONS_LIST = {"transportation": ['more_efficient_vehicle', 'alternativefuel_vehicle', 'electric_vehicle', 'hybrid_vehicle', 'telecommute_to_work', 'ride_my_bike', 'take_public_transportation', 'practice_eco_driving', 'maintain_my_vehicles', 'carpool_to_work', 'reduce_air_travel'], "shopping": ['low_carbon_diet', 'go_organic'],  "housing": ['switch_to_cfl', 'turn_off_lights', 'T12toT8', 'tankless_water_heater', 'thermostat_winter', 'thermostat_summer', 'purchase_high_efficiency_cooling', 'purchase_high_efficiency_heating', 'energy_star_fridge', 'energy_star_printers', 'energy_star_copiers', 'energy_star_desktops', 'rechargeable_batteries', 'power_mgmt_comp', 'purchase_green_electricity', 'install_PV_panels', 'install_solar_heating', 'low_flow_showerheads', 'low_flow_faucets', 'low_flow_toilet', 'line_dry_clothing', 'water_efficient_landscaping', 'plant_trees', 'reduce_comm_waste', 'print_double_sided']};

// 'offset_transportation', 'offset_housing', 'offset_shopping'

class TakeActionComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let take_action = this;
    take_action.action_keys = Object.keys(take_action.result_takeaction_pounds)
      .filter(key=> !/^offset_/.test(key));
    take_action.actions = take_action
      .action_keys
      .map((action_key)=>{
        let category;
        for (let cat in ACTIONS_LIST) {
          let index = ACTIONS_LIST[cat].find(x => x === action_key);
          if (index) category = cat;
        }
        return new Action(action_key, take_action, category);
      });
    take_action.state = take_action.userApiState();
    take_action.state['input_action_category'] = ACTION_CATEGORIES[0][0];
    take_action.state['show_actions'] = ACTIONS_LIST[ACTION_CATEGORIES[0][0]];
    take_action.state['actions'] = take_action.actions;
    take_action.state['vehicles'] = take_action.vehicles;

    take_action.state['footprint'] = take_action.state_manager.state.user_footprint;

    take_action.showActions(take_action.state.input_action_category);

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
    console.log('vehicles: ', vehicles)
    return vehicles;
  }

  get action_categories(){
    return ACTION_CATEGORIES;
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

      console.log('Vehicle -- selectOptionValues', select)
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

  actionCategoryActive(category){
    return this.state.input_action_category === category;
  }

  setActionCategory(category){
    let take_action = this;
    take_action.setState({
      input_action_category: category
    });
    take_action.showActions(category);
  }

  showActions(category){
    let take_action = this;
    take_action.actions.forEach((action) => {
      if (action.category === category) {
        action.show = true;
      } else {
        action.show = false;
      }
    })
  }

  toggleActionDetails(action){
    let take_action = this;

    action.detailed = !action.detailed;
    take_action.setState({
      actions: take_action.actions
    })
  }

  toggleAction(action){
    let take_action = this,
      update = {};
    if (action.taken){
      update[action.api_key] = 0;
    } else {
      update[action.api_key] = 1;
    }
    take_action.setState(update);
    take_action.updateTakeaction(update);
  }

  setInputState(id){
    let take_action = this,
    footprint = take_action.state_manager.state.user_footprint;
    return footprint[id]
  }

  updateActionInput(event){
    let take_action = this,
        val = event.target.value,
        id = event.target.id,
        update = {};

    update[id] = parseInt(val);
    update['input_changed'] = id;
    console.log('ID update: ', id)
    take_action.setState(update);
    take_action.updateTakeaction(update);
  }

  handleChange(event){
    let i = event.target.value,
    is_vehicle = event.target.id.lastIndexOf('vehicle_select'),
    action = event.target.dataset.action_key;

    console.log('handleChange value: ', i)
    console.log('handleChange action key: ', action)
    console.log('handleChange id: ', event.target.id)

    // @ToDo: updateTakeaction first and then show results --> Air travel needs updated miles_alt state!

    if (is_vehicle > 0) this.selectVehicle(i, action)

    if (action === 'reduce_air_travel') {

      // console.log("--- miles_percent BEFORE", footprint['input_takeaction_reduce_air_travel_miles_percent'])

      let update = {};
      update['input_takeaction_reduce_air_travel_miles_percent'] = i;
      // this.setState(update);
      this.updateTakeaction(update);
      // footprint['input_takeaction_reduce_air_travel_miles_percent'] = i;

      let footprint = this.state_manager.state.user_footprint;
      console.log("--- miles_percent", footprint['input_takeaction_reduce_air_travel_miles_percent'])

      console.log("footprint['result_takeaction_reduce_air_travel_miles_alt']", footprint['result_takeaction_reduce_air_travel_miles_alt'])
      $('#result_takeaction_reduce_air_travel_miles_alt').text(footprint['result_takeaction_reduce_air_travel_miles_alt']).append(' fewer miles per year.');
    }

  }

  selectVehicle(i, action){
    // on update, call setState and updateTakeaction

    let footprint = this.state_manager.state.user_footprint,
    v_miles = footprint[`input_footprint_transportation_miles${i}`],
    v_mpg = footprint[`input_footprint_transportation_mpg${i}`];

    console.log('vehicle miles', v_miles);


    if (action === 'ride_my_bike' || action ===  'telecommute_to_work' || action ===  'take_public_transportation') {
      console.log("('ride_my_bike' || 'telecommute_to_work' || 'take_public_transportation'): ", action);

      footprint['input_takeaction_' + action + '_mpg'] = parseInt(v_mpg);
      $('#display_takeaction_' + action + '_mpg').text(v_mpg).append(' ' + this.t(`travel.miles_per_gallon`));

    } else {

      footprint['input_takeaction_' + action + '_mpg_old'] = parseInt(v_mpg);
      footprint['input_takeaction_' + action + '_miles_old'] = parseInt(v_miles);

      $('#display_takeaction_' + action + '_mpg_old').text(v_mpg).append(' ' + this.t(`travel.miles_per_gallon`));
    }

  }

  calcVehicleTotal(action){

    let footprint = this.state_manager.state.user_footprint,
        no_vehicles = this.state['vehicles'].length,
        total_miles = 0,
        total_mpg = 0;

    this.state['vehicles'].forEach((v) => {
      total_miles += parseInt(v.miles);
      total_mpg += parseInt(v.mpg);
    });

    if (action === 'practice_eco_driving') {
      footprint['result_takeaction_practice_eco_driving_dispmiles'] = total_miles;
      $('#result_takeaction_practice_eco_driving_dispmiles').text(total_miles).append(' ' + this.t(`travel.miles_abbr`));
      footprint['result_takeaction_practice_eco_driving_mpg'] = total_mpg / no_vehicles;
      $('#result_takeaction_practice_eco_driving_mpg').text(total_mpg / no_vehicles).append(' ' + this.t(`travel.miles_per_gallon`));

      let newmpg = 'result_takeaction_practice_eco_driving_newmpg',
          galsaved = 'result_takeaction_practice_eco_driving_galsaved';

      $('#' + newmpg).text(Math.round(footprint[newmpg])).append(' ' + this.t(`travel.miles_per_gallon`));
      $('#' + galsaved).text(Math.round(footprint[galsaved])).append(' ' + this.t(`travel.gallons_per_year`));

    } else {
      $('#result_takeaction_maintain_my_vehicles_dispmiles').text(total_miles).append(' ' + this.t(`travel.miles_abbr`));
      $('#result_takeaction_maintain_my_vehicles_mpg').text(total_mpg / no_vehicles).append(' ' + this.t(`travel.miles_per_gallon`));

    }
  }

  getAirTotal(){
    let footprint = this.state_manager.state.user_footprint;

    $('#result_takeaction_reduce_air_travel_totalmiles').text(footprint['result_takeaction_reduce_air_travel_totalmiles']).append(' ' + this.t(`travel.miles_per_year`));
    $('#result_takeaction_reduce_air_travel_pounds_from_flight').text(footprint['result_takeaction_reduce_air_travel_pounds_from_flight']).append(' ' + this.t(`travel.co2_per_year`));
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

  // componentDidMount(){
  //   let take_action = this;
  //   take_action.setInputToState();
  // }


  render(){
    return template.call(this);
  }

}

TakeActionComponent.NAME = 'TakeAction';

module.exports = TakeActionComponent;
