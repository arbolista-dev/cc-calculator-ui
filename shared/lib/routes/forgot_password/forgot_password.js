/* global*/

import RouteBase from './../route.base';

class ForgotPassword extends RouteBase {

  get key() {
    return 'forgot_password';
  }

  get route_name() {
    return 'ForgotPassword';
  }

}

export default ForgotPassword;
