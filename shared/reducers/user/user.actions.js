import { createAction } from 'redux-act';

const signup = createAction('Signup user and retrieve token from User API.'),
    login = createAction('Login and retrieve token from User API.'),
    loggedIn = createAction('User successfully logged in.'),
    signedUp = createAction('User successfully signed up.'),
    logout = createAction('Logout and erase token.'),
    loggedOut = createAction('User successfully logged out.'),
    authError = createAction('Auth error.');

export { signup, login, loggedIn, signedUp, logout, loggedOut, authError };
