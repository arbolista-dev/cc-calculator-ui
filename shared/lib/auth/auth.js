/*global JS_ENV Map require*/

import UserApi from 'api/user.api';
import jwtDecode from 'jwt-decode';

export let auth = {
  signupUser: function(input){
    return UserApi.addUser(input)
      .then((res) => {
        console.log('Add new user: ', res)
        return res;
      });
  },

  loginUser: function(input){
    return UserApi.loginUser(input)
      .then((res) => {
        console.log('Login user: ', res)
        return res;
      });
  },

  logoutUser: function(token){
    return UserApi.logoutUser(token)
      .then((res) => {
        console.log('Logout user: ', res)
        return res;
      });
  },

  forgotPassword: function(input){
    return UserApi.forgotPassword(input)
      .then((res) => {
        console.log('User forgot password: ', res)
        return res;
      });
  },

  tokenIsValid: function(token){
    return jwtDecode(token) < new Date().getTime();
  }

};
