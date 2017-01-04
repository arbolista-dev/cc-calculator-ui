import { createAction } from 'redux-act';

const signup = createAction('Signup user and retrieve token from User API.');
const login = createAction('Login and retrieve token from User API.');
const loginFacebook = createAction('Login with Facebook and retrieve token from User API.');
const loggedIn = createAction('User successfully logged in.');
const signedUp = createAction('User successfully signed up.');
const logout = createAction('Logout and erase token.');
const loggedOut = createAction('User successfully logged out.');
const requestNewPassword = createAction('Request new password upon forgotten.');
const newPasswordRequested = createAction('New password got requested');
const authError = createAction('Auth error.');

export { signup, login, loginFacebook, loggedIn, signedUp, logout, loggedOut,
  requestNewPassword, newPasswordRequested, authError };
