/* global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './take_action.rt.html';

const ACTIONS = [{
  category: 'transportation',
  title: 'Transportation',
  keys: ['more_efficient_vehicle', 'alternativefuel_vehicle', 'electric_vehicle', 'hybrid_vehicle', 'telecommute_to_work', 'ride_my_bike', 'take_public_transportation', 'practice_eco_driving', 'maintain_my_vehicles', 'carpool_to_work', 'reduce_air_travel'],
}, {
  category: 'housing',
  title: 'Housing',
  keys: ['switch_to_cfl', 'turn_off_lights', 'T12toT8', 'tankless_water_heater', 'thermostat_winter', 'thermostat_summer', 'purchase_high_efficiency_cooling', 'purchase_high_efficiency_heating', 'energy_star_fridge', 'energy_star_printers', 'energy_star_copiers', 'energy_star_desktops', 'rechargeable_batteries', 'power_mgmt_comp', 'purchase_green_electricity', 'install_PV_panels', 'install_solar_heating', 'low_flow_showerheads', 'low_flow_faucets', 'low_flow_toilet', 'line_dry_clothing', 'water_efficient_landscaping', 'plant_trees', 'reduce_comm_waste', 'print_double_sided'],
}, {
  category: 'shopping',
  title: 'Shopping',
  keys: ['low_carbon_diet', 'go_organic'],
}];


class TakeActionComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const take_action = this;
    take_action.action_keys = Object.keys(take_action.result_takeaction_pounds)
      .filter(key => !/^offset_/.test(key));
    take_action.state = take_action.userApiState();
    take_action.state.input_action_category = ACTIONS[0].category;
    take_action.state.show_actions = ACTIONS[0].keys;
    take_action.state.show_critical_assumptions = false;
  }

  componentWillMount() {
    this.setActiveActionsByCategory(this.state.input_action_category);
  }

  componentDidMount() {
    this.setVehicles();
  }

  render() {
    return template.call(this);
  }

  get external_offset_set() {
    const offset = this.props.ui.get('external_offset').toJS();
    return Object.keys(offset).length !== 0;
  }

  get actions_list() {
    return ACTIONS;
  }

  get relevant_api_keys() {
    return this.action_keys;
  }

  get total_user_footprint() {
    return this.props.user_footprint.getIn(['data', 'result_grand_total']);
  }

  get result_takeaction_pounds() {
    return this.props.user_footprint.get('result_takeaction_pounds');
  }

  get result_takeaction_dollars() {
    return this.props.user_footprint.get('result_takeaction_dollars');
  }

  get result_takeaction_net10yr() {
    return this.props.user_footprint.get('result_takeaction_net10yr');
  }

  get show_critical_assumptions() {
    return this.state.show_critical_assumptions;
  }

  setVehicles() {
    const take_action = this;
    const num = take_action.userApiValue('input_footprint_transportation_num_vehicles');
    const vehicles = [];
    const ui = {};

    for (let i = 1; i <= num; i += 1) {
      const vehicle = {};
      vehicle.miles = take_action.userApiValue(`input_footprint_transportation_miles${i}`);
      vehicle.mpg = take_action.userApiValue(`input_footprint_transportation_mpg${i}`);
      vehicles.push(vehicle);
    }

    ui.id = 'vehicles';
    ui.data = vehicles;
    take_action.props.updateUI(ui);
  }

  isCategoryActive(category) {
    return this.state.input_action_category === category;
  }

  setActiveActionsByCategory(category) {
    const update = {};
    this.actions_list.forEach((group) => {
      if (category === group.category) {
        update.show_actions = group.keys;
        this.setState(update);
      }
    });
  }

  setCategory(category) {
    const take_action = this;
    take_action.setState({
      input_action_category: category,
    });
    take_action.setActiveActionsByCategory(category);
  }

  toggleCriticalAssumptions() {
    this.setState({
      show_critical_assumptions: !this.state.show_critical_assumptions,
    });
  }

  showAction(key) {
    const show = this.state.show_actions;
    if (show.includes(key)) {
      return true;
    }
    return false;
  }

  activeAction(key){
    if (key === this.state['show_actions'][0]) {
      return true;
    } else {
      return false;
    }
  }
}

TakeActionComponent.NAME = 'TakeAction';
TakeActionComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(TakeActionComponent);
