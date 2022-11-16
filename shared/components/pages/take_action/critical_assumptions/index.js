import React, { PropTypes } from 'react';
import round from 'lodash/round';
import Translatable from 'shared/lib/base_classes/translatable';
import footprintContainer from 'shared/containers/footprint.container';
import template from './critical_assumptions.rt.html';

class CriticalAssumptions extends Translatable {

  get assumptions_content() {
    return this.t('critical_assumptions.content', { returnObjects: true });
  }

  displayStateValue({ show, suffix, decimals, prefix }) {
    let state_id = show;
    if (state_id.includes('display_takeaction')) {
      state_id = state_id.replace(/display_takeaction/i, 'input_takeaction');
    }
    let value = this.userApiValue(state_id);
    if (decimals || decimals === 0) value = round(value, decimals);
    if (!isNaN(value)) value = value.toLocaleString();
    if (!suffix) {
      return `${prefix || ''}${value}`;
    }
    return `${prefix || ''}${value} ${suffix}`;
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

  setInputState(id) {
    return this.userApiValue(id);
  }

  userApiValue(api_key) {
    return this.props.user_footprint.getIn(['data', api_key]);
  }

  render() {
    return template.call(this);
  }

}

CriticalAssumptions.propTypes = {
  show: PropTypes.bool.isRequired,
};

module.exports = footprintContainer(CriticalAssumptions);
