import { connect } from 'react-redux';

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
    ensureComputeFootprint: (defaults) => {
      ensureComputeFootprint.assignTo(dispatch);
      ensureComputeFootprint(defaults);
    }
  };
}

const getStartedContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default getStartedContainer;
