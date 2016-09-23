import { connect } from 'react-redux';
import React from 'react';

import { ensureDefaults, averageFootprintUpdated } from 'shared/reducers/average_footprint/average_footprint.actions';
import { ensureUserFootprintComputed, userFootprintUpdated, updatedFootprintComputed, updateTakeactionResults } from 'shared/reducers/user_footprint/user_footprint.actions';
import { setUIState, pushUIAlarm } from 'shared/reducers/ui/ui.actions'

const mapStateToProps = (state) => {
  return {
    location: state['location'],
    average_footprint: state['average_footprint'],
    user_footprint: state['user_footprint'],
    auth: state['auth'],
    ui: state['ui']
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    ensureDefaults: (default_basic_inputs) => {
      ensureDefaults.assignTo(dispatch);
      ensureDefaults(default_basic_inputs);
    },
    averageFootprintUpdated: (updated_params) => {
      averageFootprintUpdated.assignTo(dispatch);
      averageFootprintUpdated(updated_params);
    },
    ensureUserFootprintComputed: (defaults) => {
      ensureUserFootprintComputed.assignTo(dispatch);
      ensureUserFootprintComputed(defaults);
    },
    userFootprintUpdated: (updated_params) => {
      userFootprintUpdated.assignTo(dispatch);
      userFootprintUpdated(updated_params);
    },
    updatedFootprintComputed: (updated_params) => {
      updatedFootprintComputed.assignTo(dispatch);
      updatedFootprintComputed(updated_params);
    },
    updateTakeactionResults: () => {
      updateTakeactionResults.assignTo(dispatch);
      updateTakeactionResults();
    },
    setUIState: (payload) => {
      setUIState.assignTo(dispatch);
      setUIState(payload);
    },
    pushUIAlarm: (payload) => {
      pushUIAlarm.assignTo(dispatch);
      pushUIAlarm(payload);
    }
  };
}

const footprintContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default footprintContainer;

const footprintPropTypes = {
  location: React.PropTypes.object.isRequired,
  average_footprint: React.PropTypes.object,
  user_footprint: React.PropTypes.object,
  auth: React.PropTypes.object,
  ui: React.PropTypes.object,
  ensureDefaults: React.PropTypes.func.isRequired,
  ensureUserFootprintComputed: React.PropTypes.func.isRequired,
  updateTakeactionResults: React.PropTypes.func.isRequired,
  averageFootprintUpdated: React.PropTypes.func.isRequired,
  userFootprintUpdated: React.PropTypes.func.isRequired,
  updatedFootprintComputed: React.PropTypes.func.isRequired,
  setUIState: React.PropTypes.func.isRequired,
  pushUIAlarm: React.PropTypes.func.isRequired
};

export { footprintPropTypes };
