import { createAction } from 'redux-act';

const signup = createAction('Signup user and retrieve token from User API.'),
    login = createAction('Login and retrieve token from User API.'),
    loginFacebook = createAction('Login with Facebook and retrieve token from User API.'),
    loggedIn = createAction('User successfully logged in.'),
    signedUp = createAction('User successfully signed up.'),
    logout = createAction('Logout and erase token.'),
    loggedOut = createAction('User successfully logged out.'),
    requestNewPassword = createAction('Request new password upon forgotten.'),
    newPasswordRequested = createAction('New password got requested'),
    authError = createAction('Auth error.');

export { signup, login, loginFacebook, loggedIn, signedUp, logout, loggedOut, requestNewPassword, newPasswordRequested, authError };
