/* global module clearTimeout setTimeout*/

import React from 'react';
import Translatable from 'shared/lib/base_classes/translatable';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './action.rt.html';

class ActionComponent extends Translatable {

  constructor(props, context) {
    super(props, context);
    const action = this;
    action.state = {
      key: this.props.action_key,
      category: this.props.category,
      show: this.props.show,
      detailed: false,
    };
  }

  componentDidMount() {
    if (this.category === 'transportation') this.selectVehicle(1, this.key);
    window.jQuery("[data-toggle='popover']").tooltip();
  }

  componentWillUnmount() {
    window.jQuery("[data-toggle='popover']").tooltip('destroy');
  }

  render() {
    return template.call(this);
  }

  get vehicles_loaded() {
    return this.props.ui.has('vehicles');
  }

  get api_key() {
    return `input_takeaction_${this.state.key}`;
  }

  get result_key() {
    return `result_takeaction_${this.state.key}`;
  }

  get display_name() {
    return this.t(`actions.${this.state.category}.${this.state.key}.label`);
  }

  get fact() {
    const fact = this.t(`actions.${this.state.category}.${this.state.key}.fact`, { defaultValue: '' });

    if (fact.length > 0) {
      return fact;
    }
    return false;
  }

  get rebates() {
    return this.t(`actions.${this.state.category}.${this.state.key}.rebates`, { returnObjects: true });
  }

  get taken() {
    return parseInt(this.userApiValue(this.api_key), 10) === 1;
  }

  get completed() {
    const completedActions = this.props.user_footprint.getIn(['actions', 'completed']);
    return completedActions.has(this.state.key);
  }

  get is_shown_detailed() {
    return this.state.detailed;
  }

  get content() {
    return this.t(`actions.${this.state.category}.${this.state.key}.content`, { returnObjects: true });
  }

  get assumptions_content() {
    return this.t('critical_assumptions.content', { returnObjects: true });
  }

  get tons_saved() {
    return this.numberWithCommas(Math.round(this.props.user_footprint.getIn(['result_takeaction_pounds', this.state.key]) * 100) / 100);
  }

  get dollars_saved() {
    return this.numberWithCommas(Math.round(this.props.user_footprint.getIn(['result_takeaction_dollars', this.state.key])));
  }

  get upfront_cost() {
    return this.numberWithCommas(Math.round(this.props.user_footprint.getIn(['result_takeaction_net10yr', this.state.key])));
  }

  toggleActionPledge() {
    const action = this;
    const update = {};
    if (action.taken) {
      update[action.api_key] = 0;
    } else {
      update[action.api_key] = 1;
    }
    action.setState(update);
    action.updateTakeaction(update);
    action.updateActionStatus(update);
  }

  toggleActionComplete() {
    const action = this;
    const update = {};
    if (action.completed) {
      update[action.api_key] = -2;
    } else {
      update[action.api_key] = 2;
    }
    action.setState(update);
    action.updateActionStatus(update);
  }

  discardAction(){
    const action = this;
    if (this.taken) {
      const update = { [this.api_key]: 0 };
      action.setState(update);
      action.updateTakeaction(update);
    }
    action.updateActionStatus({ [this.api_key]: -1 })
  }

  toggleActionDetails() {
    const action = this;
    action.setState({ detailed: !action.state.detailed });
  }

  setInputState(id) {
    return this.userApiValue(id);
  }

  displayStateValue(id, suffix) {
    let state_id = id;
    if (state_id.includes('display_takeaction')) {
      state_id = state_id.replace(/display_takeaction/i, 'input_takeaction');
    }
    if (!suffix) {
      return this.userApiValue(state_id);
    }
    return `${this.userApiValue(state_id)} ${suffix}`;
  }

  updateActionInput(event) {
    const action = this;
    const val = event.target.value;
    const id = event.target.id;
    const update = {};

    update[id] = val;
    update.input_changed = id;
    action.setState(update);
    action.updateTakeaction(update);
  }

  setSelectOptions(select) {
    if (select.type === 'vehicle') {
      const vehicles = [];
      let i = 1;
      this.props.ui.get('vehicles').forEach(() => {
        const vehicle = {};
        vehicle.value = i;
        vehicle.text = `Vehicle ${i}`;
        i += 1;
        vehicles.push(vehicle);
      });
      return vehicles;
    }
    return select.options;
  }

  handleChange(event) {
    const i = event.target.value;
    const is_vehicle = event.target.id.lastIndexOf('vehicle_select');
    const action_key = event.target.dataset.action_key;
    const id = event.target.id;

    if (is_vehicle > 0) {
      this.selectVehicle(i, action_key);
    } else {
      const update = {};
      update[id] = i;
      this.setState(update);
      this.updateTakeaction(update);
    }
  }

  getSelectedOption(id) {
    const is_vehicle = id.lastIndexOf('vehicle_select');
    const key = this.state.key;
    let mpg;

    if (is_vehicle > 0) {
      if (key === 'ride_my_bike' || key === 'telecommute_to_work' || key === 'take_public_transportation') {
        mpg = this.props.user_footprint.getIn(['data', `input_takeaction_${key}_mpg`]);
      } else {
        mpg = this.props.user_footprint.getIn(['data', `input_takeaction_${key}_mpg_old`]);
      }

      for (let i = 1; i <= 10; i += 1) {
        const fp_mpg = this.props.user_footprint.getIn(['data', `input_footprint_transportation_mpg${i}`]);
        if (fp_mpg === mpg) {
          return i;
        }
      }
    }
    return this.userApiValue(id);
  }

  selectVehicle(i, action_key) {
    const v_miles = this.props.user_footprint.getIn(['data', `input_footprint_transportation_miles${i}`]);
    const v_mpg = this.props.user_footprint.getIn(['data', `input_footprint_transportation_mpg${i}`]);
    const update = {};
    if (action_key === 'ride_my_bike' || action_key === 'telecommute_to_work' || action_key === 'take_public_transportation') {
      update[`input_takeaction_${action_key}_mpg`] = parseInt(v_mpg, 10);
      this.setState(update);
      this.updateTakeaction(update);
    } else {
      update[`input_takeaction_${action_key}_mpg_old`] = parseInt(v_mpg, 10);
      update[`input_takeaction_${action_key}_miles_old`] = parseInt(v_miles, 10);
      this.setState(update);
      this.updateTakeaction(update);
    }
  }

  userApiValue(api_key) {
    return this.props.user_footprint.getIn(['data', api_key]);
  }

  getUserFootprint() {
    return this.props.user_footprint.get('data');
  }

  userApiState() {
    const action = this;
    const keys = Object.keys(action.getUserFootprint().toJS())
      .filter(key => key.includes(action.result_key));
    const api_state = {};
    return keys.reduce((hash, api_key) => {
      api_state[api_key] = action.userApiValue(api_key);
      return api_state;
    }, {});
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  updateFootprintParams(params) {
    this.props.userFootprintUpdated(params);
  }

  updateTakeaction(params) {
    const action = this;

    // action.state_manager.update_in_progress = true;
    action.updateFootprintParams(params);

    if (action.$update_takeaction) {
      clearTimeout(action.$update_takeaction);
    }

    action.$update_takeaction = setTimeout(() => {
      action.props.updateTakeactionResult();
      const user_api_state = action.userApiState();
      action.setState(user_api_state);
    }, 500);
  }

  updateActionStatus(params) {
    const key = this.state.key;
    const status = params[this.api_key];
    let update = {};

    if (status === 1) {
      update = {
        key,
        status: 'pledged',
        details: {
          tons_saved: this.tons_saved,
          dollars_saved: this.dollars_saved,
          upfront_cost: this.upfront_cost,
        },
      };
    } else if (status === 0) {
      update = {
        key,
        status: 'unpledged',
      };
    } else if (status === -1) {
      update = {
        key,
        status: 'not_relevant',
      };
    } else if (status === 2) {
      update = {
        key,
        status: 'completed',
        details: {
          tons_saved: this.tons_saved,
          dollars_saved: this.dollars_saved,
          upfront_cost: this.upfront_cost,
        },
      };
    } else if (status === -2) {
      update = {
        key,
        status: 'uncompleted',
      };
    }

    console.log('update', update);
    this.props.updateActionStatus(update)
  }
}

ActionComponent.NAME = 'Action';
ActionComponent.propTypes = Object.assign({}, {
  is_assumption: React.PropTypes.bool.isRequired,
  action_key: React.PropTypes.string,
  category: React.PropTypes.string,
  show: React.PropTypes.bool,
}, footprintPropTypes);

module.exports = footprintContainer(ActionComponent);
