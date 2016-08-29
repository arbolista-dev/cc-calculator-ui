import { connect } from 'react-redux';

import { ensureDefaults } from 'shared/reducers/defaults_and_results/defaults_and_results.actions';
import { ensureComputeFootprint } from 'shared/reducers/compute_footprint/compute_footprint.actions';

const mapStateToProps = (state) => {
  return {
    location: state['location'],
    user_footprint: state['user_footprint'],
    defaults: state['defaults']
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    ensureDefaults: (default_basic_inputs) => {
      ensureDefaults.assignTo(dispatch);
      ensureDefaults(default_basic_inputs);
    },
    ensureComputeFootprint: (defaults) => {
      ensureComputeFootprint.assignTo(dispatch);
      ensureComputeFootprint(defaults);
    }
  };
}

const layoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default layoutContainer;
