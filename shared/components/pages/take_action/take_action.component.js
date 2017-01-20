/* global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './take_action.rt.html';

const ACTIONS = [{
  id: 'transportation',
  title: 'Transportation',
  keys: ['more_efficient_vehicle', 'alternativefuel_vehicle', 'electric_vehicle', 'hybrid_vehicle', 'telecommute_to_work', 'ride_my_bike', 'take_public_transportation', 'practice_eco_driving', 'maintain_my_vehicles', 'carpool_to_work', 'reduce_air_travel'],
}, {
  id: 'housing',
  title: 'Housing',
  keys: ['switch_to_cfl', 'turn_off_lights', 'T12toT8', 'tankless_water_heater', 'thermostat_winter', 'thermostat_summer', 'purchase_high_efficiency_cooling', 'purchase_high_efficiency_heating', 'energy_star_fridge', 'energy_star_printers', 'energy_star_copiers', 'energy_star_desktops', 'rechargeable_batteries', 'power_mgmt_comp', 'purchase_green_electricity', 'install_PV_panels', 'install_solar_heating', 'low_flow_showerheads', 'low_flow_faucets', 'low_flow_toilet', 'line_dry_clothing', 'water_efficient_landscaping', 'plant_trees', 'reduce_comm_waste', 'print_double_sided'],
}, {
  id: 'shopping',
  title: 'Shopping',
  keys: ['low_carbon_diet', 'go_organic'],
}];


class TakeActionComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const take_action = this;
    // take_action.action_keys = Object.keys(take_action.result_takeaction_pounds)
      // .filter(key => !/^offset_/.test(key));
    // take_action.state = take_action.userApiState();
    take_action.state = {
      active_category_filter: '',
      active_status_filter: 'all',
      sort_by: 'inactive',
      show_actions: this.all_actions,
      show_critical_assumptions: false,
    };
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

  get actions_by_category() {
    return ACTIONS;
  }

  get all_actions(){
    let all_actions = [];
    this.actions_by_category.map((category) => {
      all_actions = all_actions.concat(category.keys)
    });
    return all_actions;
  }

  get current_actions_list() {
    // console.log('current_actions_list', this.state.show_actions);
    return this.state.show_actions;
  }

  get category_list() {
    return ([{title: 'All', id: ''}]).concat(this.actions_by_category);
  }

  get status_list() {
    return [{title: 'All', key: 'all'}, {title: 'Pledged', key: 'pledged'}, {title: 'Completed', key: 'completed'}, {title: 'Not pledged', key: 'not_pledged'}, {title: 'Relevant', key: 'relevant'}, {title: 'Not relevant', key: 'not_relevant'}];
  }

  get sort_options() {
    return [{title: ' - ', id: 'inactive'}, {title: 'Title', id: 'title'}, {title: 'Carbon savings', id: 'tons_saved'}, {title: 'Money savings', id: 'dollars_saved'}, {title: 'Down payment', id: 'upfront_cost'}];
  }

  get sort_by_active() {
    console.log('sort_by', this.state.sort_by !== 'inactive');
    return this.state.sort_by !== 'inactive';
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

  get actions_profile() {
    return this.props.user_footprint.get('actions');
  }

  get show_critical_assumptions() {
    return this.state.show_critical_assumptions;
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

  getCategoryByAction(action_key) {
    let id;
    this.actions_by_category.forEach((category) => {
      if (category.keys.includes(action_key)) {
        id = category.id;
      }
    });
    return id;
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
    return this.state.active_category_filter === category;
  }

  isStatusFilterActive(key) {
    return this.state.active_status_filter === key;
  }

  filterActionsByCategory(category) {
    const update = {};
    if (!category) {
      update.show_actions = this.all_actions;
    } else {
      this.actions_by_category.forEach((group) => {
        if (category === group.id) {
          update.show_actions = group.keys;
        }
      });
    }

    //@ToDo: check status filter!


    this.setState(update);
  }

  filterActionsByStatus(status) {
    // @ToDo: user_footprint.get('actions') to check if key exists!
    const take_action = this;
    const actions_profile = take_action.actions_profile;
    const update = {};
    console.log('actions profile', actions_profile.toJS());

    if (status === 'pledged' || status === 'completed') {
      update.show_actions = Object.keys(take_action.actions_profile.get(status).toJS());

    } else if (status === 'not_relevant') {
      update.show_actions = take_action.actions_profile.get(status).toJS();

    } else if (status === 'not_pledged') {

      const pledged = Object.keys(take_action.actions_profile.get('pledged').toJS());
      const not_pledged = take_action.all_actions.filter(key => !pledged.includes(key));

      update.show_actions = not_pledged;

    } else if (status === 'relevant') {

      const not_relevant = take_action.actions_profile.get('not_relevant').toJS();
      const relevant = take_action.all_actions.filter(key => !not_relevant.includes(key));

      update.show_actions = relevant;

    } else if (status === 'all') {
      update.show_actions = take_action.all_actions;
    }

    // @ToDo: check if category filter active and if yes use update.show_actions to refilter for specific category!

    take_action.setState(update);
  }

  setCategory(category) {
    const take_action = this;
    take_action.setState({
      active_category_filter: category,
    });
    take_action.filterActionsByCategory(category);
  }

  setStatusFilter(status) {
    const take_action = this;
    take_action.setState({
      active_status_filter: status,
    });
    take_action.filterActionsByStatus(status);
    console.log('set status filter', status);
  }

  handleSortByChange(e) {
    const sort_by = e.target.value;

    if (sort_by === 'inactive') {
      const actions = this.all_actions;
      this.setState({show_actions: actions, sort_by});
      this.activateCarouselItem(actions[0]);

    } else {

      const actions = this.current_actions_list;
      if (sort_by === 'title') {
        actions.sort((a, b) => {
          const aLabel = this.t(`actions.${this.getCategoryByAction(a)}.${a}.label`);
          const bLabel = this.t(`actions.${this.getCategoryByAction(b)}.${b}.label`);

          if (aLabel < bLabel) {
            return -1;
          }
          if (aLabel > bLabel) {
            return 1;
          }
          return 0;
        });
      } else if (sort_by === 'tons_saved') {
        actions.sort((a, b) => {
          const aSavings = this.getTonsSavedByAction(a);
          const bSavings = this.getTonsSavedByAction(b);

          if (aSavings > bSavings) {
            return -1;
          }
          if (aSavings < bSavings) {
            return 1;
          }
          return 0;
        });
      } else if (sort_by === 'dollars_saved') {
        actions.sort((a, b) => {
          const aSavings = this.getDollarsSavedByAction(a);
          const bSavings = this.getDollarsSavedByAction(b);

          if (aSavings > bSavings) {
            return -1;
          }
          if (aSavings < bSavings) {
            return 1;
          }
          return 0;
        });
      } else if (sort_by === 'upfront_cost') {
        actions.sort((a, b) => {
          const aCost = this.getUpfrontCostByAction(a);
          const bCost = this.getUpfrontCostByAction(b);

          if (aCost < bCost) {
            return -1;
          }
          if (aCost > bCost) {
            return 1;
          }
          return 0;
        });
      }
      this.setState({show_actions: actions, sort_by});
      this.activateCarouselItem(actions[0]);
    }
  }

  toggleFilterAndSort() {
    this.setState({
      show_filter_sort: !this.state.show_filter_sort,
    });
  }

  toggleCriticalAssumptions(){
    this.setState({
      show_critical_assumptions: !this.state.show_critical_assumptions,
    });
  }

  showActionCard(key) {
    return this.current_actions_list.includes(key);
  }

  activateCarouselItem(key){
    return key === this.current_actions_list[0];
  }
}

TakeActionComponent.NAME = 'TakeAction';
TakeActionComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(TakeActionComponent);
