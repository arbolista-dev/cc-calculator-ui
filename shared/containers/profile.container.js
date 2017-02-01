import React from 'react';
import { connect } from 'react-redux';

import { retrieveProfile } from 'shared/reducers/profile/profile.actions';
import { updateUI } from 'shared/reducers/ui/ui.actions';


const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  location: state.location,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
  retrieveProfile: (user_id) => {
    retrieveProfile.assignTo(dispatch);
    retrieveProfile(user_id);
  },
  updateUI: (payload) => {
    updateUI.assignTo(dispatch);
    updateUI(payload);
  },
});

const profileContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const profilePropTypes = {
  ui: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  auth: React.PropTypes.object,
  retrieveProfile: React.PropTypes.func.isRequired,
  updateUI: React.PropTypes.func.isRequired,
};

export default profileContainer;
export { profilePropTypes };
