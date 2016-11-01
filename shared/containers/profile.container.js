import React from 'react';
import { connect } from 'react-redux';
import { retrieveProfile } from 'shared/reducers/profile/profile.actions';

const mapStateToProps = (state) => {
  return {
    profile: state['profile'],
    location: state['location']
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    retrieveProfile: (user_id) => {
      retrieveProfile.assignTo(dispatch);
      retrieveProfile(user_id);
    }
  };
};

const profileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
);

const profilePropTypes = {
  profile: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  retrieveProfile: React.PropTypes.func.isRequired
};

export default profileContainer;
export { profilePropTypes };
