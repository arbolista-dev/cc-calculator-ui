/*global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import { Map } from 'immutable';
import template from './take_action.rt.html'
import footprintContainer from 'shared/containers/footprint.container';
import { footprintPropTypes } from 'shared/containers/footprint.container';

export const ACTIONS = [{
  'category': 'transportation', 'title': 'Transportation',
  'keys': ['more_efficient_vehicle', 'alternativefuel_vehicle', 'electric_vehicle', 'hybrid_vehicle', 'telecommute_to_work', 'ride_my_bike', 'take_public_transportation', 'practice_eco_driving', 'maintain_my_vehicles', 'carpool_to_work', 'reduce_air_travel']
}, {
  'category': 'housing', 'title': 'Housing',
  'keys': ['switch_to_cfl', 'turn_off_lights', 'T12toT8', 'tankless_water_heater', 'thermostat_winter', 'thermostat_summer', 'purchase_high_efficiency_cooling', 'purchase_high_efficiency_heating', 'energy_star_fridge', 'energy_star_printers', 'energy_star_copiers', 'energy_star_desktops', 'rechargeable_batteries', 'power_mgmt_comp', 'purchase_green_electricity', 'install_PV_panels', 'install_solar_heating', 'low_flow_showerheads', 'low_flow_faucets', 'low_flow_toilet', 'line_dry_clothing', 'water_efficient_landscaping', 'plant_trees', 'reduce_comm_waste', 'print_double_sided']
}, {
  'category': 'shopping', 'title': 'Shopping',
  'keys': ['low_carbon_diet', 'go_organic']
}];


class TakeActionComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let take_action = this;
    take_action.action_keys = Object.keys(take_action.result_takeaction_pounds)
      .filter(key=> !/^offset_/.test(key));
    take_action.state = take_action.userApiState();
    take_action.state['input_action_category'] = ACTIONS[0].category;
    take_action.state['show_actions'] = ACTIONS[0].keys;
    take_action.state['show_critical_assumptions'] = false;
    this.state.show_filters = false;
  }

  componentDidMount(){
    this.setVehicles();
  }

  render(){
    return template.call(this);
  }

  get external_offset_set(){
    let offset = this.props.ui.get('external_offset').toJS();
    return Object.keys(offset).length !== 0;
  }

  get actions_list(){
    return ACTIONS;
  }

  get category_keys() {
    return flatten(
      ACTIONS.map(category => category.keys.map(key => [category.category, key])));
  }

  get relevant_api_keys(){
    return this.action_keys;
  }

  get total_user_footprint(){
    return this.props.user_footprint.getIn(['data', 'result_grand_total']);
  }

  get result_takeaction_pounds(){
    return this.props.user_footprint.get('result_takeaction_pounds');
  }

  get result_takeaction_dollars(){
    return this.props.user_footprint.get('result_takeaction_dollars');
  }

  get result_takeaction_net10yr(){
    return this.props.user_footprint.get('result_takeaction_net10yr');
  }

  get show_critical_assumptions(){
    return this.state['show_critical_assumptions']
  }

  toggleFilterVisibility() {
    this.setState({
      show_filters: !this.state.show_filters,
    });
  }

  setVehicles(){
    let take_action = this,
        num = take_action.userApiValue('input_footprint_transportation_num_vehicles'),
        vehicles = [],
        ui = {};

    for (let i=1; i<=num; i++){
      let vehicle = {};
      vehicle.miles = take_action.userApiValue(`input_footprint_transportation_miles${i}`);
      vehicle.mpg = take_action.userApiValue(`input_footprint_transportation_mpg${i}`);
      vehicles.push(vehicle);
    }

    ui.id = 'vehicles';
    ui.data = vehicles;
    take_action.props.updateUI(ui);
  }

  isCategoryActive(category){
    return this.state.input_action_category === category;
  }

  toggleCriticalAssumptions(){
    this.setState({
      show_critical_assumptions: !this.state.show_critical_assumptions
    });
  }

  /*
   * Filtering and Sorting Actions
   */

  get actions_profile() {
    return this.props.user_footprint.get('actions');
  }

  get all_actions() {
    return flatten(this.actions_by_category.map(category => category.keys))
      .filter(key => !/^offset_/.test(key));
  }

  get filters() {
    return this.props.ui.getIn(['take_action', 'filters'], Map());
  }

  filter(filters) {
    this.props.updateUI({
      id: 'take_action',
      data: {
        filters,
      },
    });
  }

  sort(attribute) {
    const sort_by = this.props.ui.getIn(['take_action', 'sort_by']);
    const data = {
      sort_by: attribute,
    };
    if (attribute === sort_by) {
      const sort_reverse = this.props.ui.getIn(['take_action', 'sort_reverse']);
      data.sort_reverse = !sort_reverse;
    }
    this.props.updateUI({
      id: 'take_action',
      data,
    });
  }

  get sorted_filtered_actions() {
    const { filters } = this;

    // category
    let actions = !filters.get('category') ? this.all_actions : this.getActionsByCategory(filters.get('category'));

    // status
    if (filters.get('status') === 'not_pledged') {
      actions = actions.filter(key => !this.actions_profile.get('pledged', Map()).has(key));
    } else if (filters.get('status')) {
      actions = actions.filter(key => this.actions_profile.get(filters.get('status'), Map()).has(key));
    }

    // relevance
    if (filters.get('relevance') === 'relevant') {
      actions = actions.filter(key => !this.actions_profile.get('not_relevant').includes(key));
    } else if (filters.get('relevance') === 'not_relevant') {
      actions = actions.filter(key => this.actions_profile.get('not_relevant').includes(key));
    }

    return this.sortActions(actions);
  }

  sortActions(actions_to_sort) {
    const sort_by = this.props.ui.getIn(['take_action', 'sort_by']);

    if (!sort_by) return actions_to_sort;

    const sort_reverse = this.props.ui.getIn(['take_action', 'sort_reverse']);
    if (sort_by === 'title') {
      actions_to_sort.sort((a, b) => {
        const aLabel = this.t(`actions.${this.actionCategory(a)}.${a}.label`);
        const bLabel = this.t(`actions.${this.actionCategory(b)}.${b}.label`);

        if (aLabel < bLabel) return sort_reverse ? 1 : -1;
        if (aLabel > bLabel) return sort_reverse ? -1 : 1;
        return 0;
      });
    } else if (sort_by === 'tons_saved') {
      actions_to_sort.sort((a, b) => {
        const aSavings = this.getTonsSavedByAction(a);
        const bSavings = this.getTonsSavedByAction(b);

        if (aSavings > bSavings) return sort_reverse ? 1 : -1;
        if (aSavings < bSavings) return sort_reverse ? -1 : 1;
        return 0;
      });
    } else if (sort_by === 'dollars_saved') {
      actions_to_sort.sort((a, b) => {
        const aSavings = this.getDollarsSavedByAction(a);
        const bSavings = this.getDollarsSavedByAction(b);

        if (aSavings > bSavings) return sort_reverse ? 1 : -1;
        if (aSavings < bSavings) return sort_reverse ? -1 : 1;
        return 0;
      });
    } else if (sort_by === 'upfront_cost') {
      actions_to_sort.sort((a, b) => {
        const aCost = this.getUpfrontCostByAction(a);
        const bCost = this.getUpfrontCostByAction(b);

        if (aCost < bCost) return sort_reverse ? 1 : -1;
        if (aCost > bCost) return sort_reverse ? -1 : 1;
        return 0;
      });
    }
    return actions_to_sort;
  }

  getActionsByCategory(category) {
    return this.actions_by_category.find(group => group.id === category).keys
      .filter(key => !/^offset_/.test(key));
  }

  actionCategory(action_key) {
    return this.actions_by_category.find(group => includes(group.keys, action_key)).id;
  }

  getTonsSavedByAction(action_key) {
    return Math.round(this.result_takeaction_pounds.get(action_key) * 100);
  }

  getDollarsSavedByAction(action_key) {
    return Math.round(this.result_takeaction_dollars.get(action_key));
  }

  getUpfrontCostByAction(action_key) {
    return Math.round(this.result_takeaction_net10yr.get(action_key));
  }

}

TakeActionComponent.NAME = 'TakeAction';
TakeActionComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(TakeActionComponent);
