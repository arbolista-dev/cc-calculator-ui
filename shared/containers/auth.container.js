import React from 'react';
import { connect } from 'react-redux';

import { signup, login, loginFacebook, logout, requestNewPassword, resetPassword } from 'shared/reducers/auth/auth.actions';
import { pushAlert, resetAlerts } from 'shared/reducers/ui/ui.actions';

const mapStateToProps = state => ({
  auth: state.auth,
  ui: state.ui,
  location: state.location,
});

const mapDispatchToProps = dispatch => ({
  pushAlert: (payload) => {
    dispatch(pushAlert(payload));
  },
  resetAlerts: () => {
    resetAlerts.assignTo(dispatch);
    resetAlerts();
  },
  signup: (params) => {
    signup.assignTo(dispatch);
    signup(params);
  },
  login: (params) => {
    login.assignTo(dispatch);
    login(params);
  },
  loginFacebook: (params) => {
    loginFacebook.assignTo(dispatch);
    loginFacebook(params);
  },
  logout: () => {
    logout.assignTo(dispatch);
    logout();
  },
  requestNewPassword: (params) => {
    requestNewPassword.assignTo(dispatch);
    requestNewPassword(params);
  },
  resetPassword: (params) => {
    resetPassword.assignTo(dispatch);
    resetPassword(params);
  },
});

const authContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const authPropTypes = {
  auth: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  pushAlert: React.PropTypes.func.isRequired,
  resetAlerts: React.PropTypes.func.isRequired,
  signup: React.PropTypes.func.isRequired,
  login: React.PropTypes.func.isRequired,
  loginFacebook: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
  requestNewPassword: React.PropTypes.func.isRequired,
};

export default authContainer;
export { authPropTypes };
