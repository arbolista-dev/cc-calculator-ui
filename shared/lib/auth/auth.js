/*global JS_ENV Map require*/

import UserApi from 'api/user.api';

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

};
