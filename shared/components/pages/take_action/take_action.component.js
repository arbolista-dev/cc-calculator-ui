/* global module window*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './take_action.rt.html';

class TakeActionComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const take_action = this;
    take_action.STATUS_OPTIONS = [
      { key: 'all', title: this.t('take_action.status_options.all') },
      { key: 'pledged', title: this.t('take_action.status_options.pledged') },
      { key: 'not_pledged', title: this.t('take_action.status_options.not_pledged') },
      { key: 'relevant', title: this.t('take_action.status_options.relevant') },
      { key: 'not_relevant', title: this.t('take_action.status_options.not_relevant') },
      { key: 'completed', title: this.t('take_action.status_options.completed') },
    ];
    take_action.SORT_OPTIONS = [
      { id: 'inactive', title: ' - ' },
      { id: 'title', title: this.t('take_action.sort_options.title') },
      { id: 'tons_saved', title: this.t('take_action.sort_options.tons_saved') },
      { id: 'dollars_saved', title: this.t('take_action.sort_options.dollars_saved') },
      { id: 'upfront_cost', title: this.t('take_action.sort_options.upfront_cost') },
    ];
    take_action.state = {
      show_category_filter: false,
      show_status_filter: false,
      show_sort_by: false,
      show_actions: this.all_actions,
      show_critical_assumptions: false,
      current_carousel_card_index: 0,
    };
  }

  componentDidMount() {
    if (this.param_action_key) {
      this.goToActionCardByUrlParam(this.param_action_key);
    }
    this.setVehicles();
    this.initCarouselSlideListener();
  }

  componentWillUnmount() {
    window.jQuery('#action-carousel').off('slid.bs.carousel');
  }

  render() {
    return template.call(this);
  }

  get external_offset_set() {
    const offset = this.props.ui.get('external_offset').toJS();
    return Object.keys(offset).length !== 0;
  }

  get param_action_key() {
    return this.props.location.getIn(['params', 'action_key']);
  }

  get all_actions() {
    return this.actions_by_category.map(category => category.keys)
      .reduce((all, arr) => all.concat(arr));
  }

  get current_actions_list() {
    return this.state.show_actions;
  }

  get category_list() {
    return ([{ title: this.t('take_action.categories.all'), id: 'all' }]).concat(this.actions_by_category);
  }

  get status_list() {
    return this.user_authenticated ? this.STATUS_OPTIONS : this.STATUS_OPTIONS.slice(0, -1);
  }

  get sort_options() {
    return this.SORT_OPTIONS;
  }

  get isSortByActive() {
    return this.active_sort_by !== 'inactive';
  }

  get active_category_filter() {
    return this.props.ui.getIn(['take_action', 'category_filter']);
  }

  get active_status_filter() {
    return this.props.ui.getIn(['take_action', 'status_filter']);
  }

  get active_sort_by() {
    return this.props.ui.getIn(['take_action', 'sort_by']);
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

  goToActionCardByUrlParam(key) {
    const index = this.current_actions_list.indexOf(key);
    if (index !== -1) {
      this.props.updateUI({ id: 'take_action', data: { category_filter: 'all', status_filter: 'all' } });
      this.setState({ current_carousel_card_index: index });
    }
  }

  initCarouselSlideListener() {
    window.jQuery('#action-carousel').on('slid.bs.carousel', () => {
      const updated_action_key = window.jQuery('.carousel-inner').find('.active').attr('id');
      this.router.goToActionByKey(updated_action_key);
    });
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

  categoryIsTransportation(key) {
    return this.getCategoryByAction(key) === 'transportation';
  }

  isCategoryActive(category) {
    return this.active_category_filter === category;
  }

  isStatusFilterActive(key) {
    return this.active_status_filter === key;
  }

  filterAndSortActions(_category, _status, sort_by) {
    const take_action = this;
    const update = {};
    const category = _category || this.active_category_filter;
    const status = _status || this.active_status_filter;
    let updated_sort_by;

    if (category === 'all') {
      update.show_actions = take_action.all_actions;
    } else {
      update.show_actions = take_action.getActionsByCategory(category);
    }

    if (status !== 'all') {
      update.show_actions = take_action.getActionsByStatus(update.show_actions, status);
    }

    if (!sort_by) {
      updated_sort_by = 'inactive';
    } else if (sort_by !== 'inactive') {
      update.show_actions = take_action.sortActions(update.show_actions, sort_by);
      updated_sort_by = sort_by;
    }

    take_action.props.updateUI({ id: 'take_action', data: { sort_by: updated_sort_by } });
    take_action.setState(update);
  }

  setCategory(category) {
    const take_action = this;
    take_action.props.updateUI({ id: 'take_action', data: { category_filter: category } });
    take_action.filterAndSortActions(category, '', '');
  }

  getActionsByCategory(category) {
    let actions;
    this.actions_by_category.forEach((group) => {
      if (category === group.id) {
        actions = group.keys;
      }
    });
    return actions;
  }

  getActionsByStatus(actions_to_filter, status) {
    const take_action = this;
    let filtered;

    if (status === 'pledged' || status === 'completed') {
      filtered = take_action.actions_profile.get(status);
      filtered = actions_to_filter.filter(key => filtered.has(key));
    } else if (status === 'not_relevant') {
      filtered = take_action.actions_profile.get(status);
      filtered = actions_to_filter.filter(key => filtered.has(key));
    } else if (status === 'not_pledged') {
      const pledged = take_action.actions_profile.get('pledged');
      const not_pledged = actions_to_filter.filter(key => !pledged.has(key));

      filtered = not_pledged;
    } else if (status === 'relevant') {
      const not_relevant = take_action.actions_profile.get('not_relevant');
      const relevant = actions_to_filter.filter(key => !not_relevant.has(key));

      filtered = relevant;
    } else if (status === 'all') {
      filtered = actions_to_filter;
    }

    return filtered;
  }

  setStatusFilter(status) {
    const take_action = this;
    take_action.props.updateUI({ id: 'take_action', data: { status_filter: status } });
    take_action.filterAndSortActions('', status, '');
  }

  sortActions(actions_to_sort, sort_by) {
    if (sort_by === 'inactive') {
      return this.all_actions;
    }

    if (sort_by === 'title') {
      actions_to_sort.sort((a, b) => {
        const aLabel = this.t(`actions.${a}.label`);
        const bLabel = this.t(`actions.${b}.label`);

        if (aLabel < bLabel) {
          return -1;
        }
        if (aLabel > bLabel) {
          return 1;
        }
        return 0;
      });
    } else if (sort_by === 'tons_saved') {
      actions_to_sort.sort((a, b) => {
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
      actions_to_sort.sort((a, b) => {
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
      actions_to_sort.sort((a, b) => {
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
    return actions_to_sort;
  }

  handleSortByChange(e) {
    const sort_by = e.target.value;

    this.filterAndSortActions('', '', sort_by);
  }

  toggleFilterAndSort(key) {
    this.setState({
      [key]: !this.state[key],
    });
  }

  toggleCriticalAssumptions() {
    this.setState({
      show_critical_assumptions: !this.state.show_critical_assumptions,
    });
  }

  showActionCard(key) {
    return this.current_actions_list.includes(key);
  }

  activateCarouselItem(key) {
    return key === this.current_actions_list[this.state.current_carousel_card_index];
  }
}

TakeActionComponent.NAME = 'TakeAction';
TakeActionComponent.propTypes = footprintPropTypes;

module.exports = footprintContainer(TakeActionComponent);
