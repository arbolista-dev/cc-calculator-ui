import { connect } from 'react-redux';

import { ensureDefaults } from 'shared/reducers/average_footprint/average_footprint.actions';
import { ensureUserFootprintComputed } from 'shared/reducers/user_footprint/user_footprint.actions';

const mapStateToProps = (state) => {
  return {
    defaults: state['defaults'],
    user_footprint: state['user_footprint']
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    ensureDefaults: (default_basic_inputs) => {
      ensureDefaults.assignTo(dispatch);
      ensureDefaults(default_basic_inputs);
    },
    ensureUserFootprintComputed: (defaults) => {
      ensureUserFootprintComputed.assignTo(dispatch);
      ensureUserFootprintComputed(defaults);
    }
  };
}

const getStartedContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default getStartedContainer;
