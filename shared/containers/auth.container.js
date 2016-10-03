  import { connect } from 'react-redux';
import React from 'react';

import { signup, login, logout, requestNewPassword } from 'shared/reducers/auth/auth.actions';

const mapStateToProps = (state) => {
  return {
    auth: state['auth']
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (params) => {
      signup.assignTo(dispatch);
      signup(params);
    },
    login: (params) => {
      login.assignTo(dispatch);
      login(params);
    },
    logout: () => {
      logout.assignTo(dispatch);
      logout();
    },
    requestNewPassword: (params) => {
      requestNewPassword.assignTo(dispatch);
      requestNewPassword(params);
    }
  };
};

const authContainer = connect(
  mapStateToProps,
  mapDispatchToProps
);

const authPropTypes = {
  auth: React.PropTypes.object.isRequired,
  signup: React.PropTypes.func.isRequired,
  login: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
  requestNewPassword: React.PropTypes.func.isRequired
};

export default authContainer;
export { authPropTypes };
