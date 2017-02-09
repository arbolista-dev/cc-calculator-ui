/* global module window APP_ID document*/
/* eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

import React from 'react';
import Translatable from 'shared/lib/base_classes/translatable';
import authContainer, { authPropTypes } from 'shared/containers/auth.container';
import template from './logout.rt.html';

class LogoutComponent extends Translatable {

  constructor(props, context) {
    super(props, context);
    const logout = this;
    logout.state = {};
  }

  render() {
    return template.call(this);
  }

  submitLogout(event) {
    event.preventDefault();
    this.props.resetAlerts();
    const response = window.FB.getLoginStatus(res => res);
    (response && response.status === 'connected') ? window.FB.logout() : this.props.logout();
  }

  componentDidMount() {
    window.fbAsyncInit = () => {
      window.FB.init({
        version: 'v2.3',
        appId: APP_ID,
        xfbml: false,
        cookie: false,
      });
    };
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/all.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

}

LogoutComponent.NAME = 'Logout';
LogoutComponent.propTypes = authPropTypes;

module.exports = authContainer(LogoutComponent);
