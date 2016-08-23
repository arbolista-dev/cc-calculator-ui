import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    location: state['location']
  };
}

const mapDispatchToProps = (dispatch) => {
  return {};
}

const layoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default layoutContainer;
