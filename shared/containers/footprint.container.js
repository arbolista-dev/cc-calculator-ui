import { connect } from 'react-redux';
import React from 'react';

import { ensureDefaults, averageFootprintUpdated } from 'shared/reducers/average_footprint/average_footprint.actions';
import { ensureComputeFootprint, userFootprintUpdated } from 'shared/reducers/compute_footprint/compute_footprint.actions';

const mapStateToProps = (state) => {
  return {
    location: state['location'],
    average_footprint: state['average_footprint'],
    user_footprint: state['user_footprint'],
    auth: state['auth']
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
    ensureComputeFootprint: (defaults) => {
      ensureComputeFootprint.assignTo(dispatch);
      ensureComputeFootprint(defaults);
    },
    userFootprintUpdated: (updated_params) => {
      userFootprintUpdated.assignTo(dispatch);
      userFootprintUpdated(updated_params);
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
  ensureDefaults: React.PropTypes.func.isRequired,
  ensureComputeFootprint: React.PropTypes.func.isRequired
};

export { footprintPropTypes };
