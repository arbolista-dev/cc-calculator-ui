  import { connect } from 'react-redux';
import React from 'react';

import { signup, login, logout, requestPassword } from 'shared/reducers/user/user.actions';

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
    requestPassword: () => {
      requestPassword.assignTo(dispatch);
      requestPassword();
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
  requestPassword: React.PropTypes.func.isRequired
};

export default authContainer;
export { authPropTypes };
