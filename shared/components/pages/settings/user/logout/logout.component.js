/*global module*/

import React from 'react';
import Translatable from 'shared/lib/base_classes/translatable';
import template from './logout.rt.html';
import authContainer from 'shared/containers/auth.container';
import { authPropTypes } from 'shared/containers/auth.container';
import FacebookLogin from 'react-facebook-login';
const appId =APP_ID;

class LogoutComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let logout = this;
    logout.state = {}
  }

  render(){
    return template.call(this);
  }

  submitLogout(event) {
    event.preventDefault();
    let response = window.FB.getLoginStatus((response) => { return response });
    (response && response.status === 'connected') ? window.FB.logout() : this.props.logout();
  }
  
  componentDidMount() {
    window.fbAsyncInit = () => {
      window.FB.init({
        version: "v2.3",
        appId:APP_ID,
        xfbml:false,
        cookie:false
      });
    }
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/en_US/all.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

}

LogoutComponent.NAME = 'Logout';
LogoutComponent.propTypes = authPropTypes;

module.exports = authContainer(LogoutComponent);
