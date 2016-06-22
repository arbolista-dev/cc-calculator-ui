/*global JS_ENV Map require*/

import UserApi from 'api/user.api';

export let auth = {
  signupUser: function(input){
    return UserApi.addUser(input)
      .then((res) => {
        console.log('Add new user: ', res)
        return res;
      });
  }

};
