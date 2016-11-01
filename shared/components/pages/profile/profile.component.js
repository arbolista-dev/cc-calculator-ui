/*global module window $*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './profile.rt.html';
import profileContainer from 'shared/containers/profile.container';
import { profilePropTypes } from 'shared/containers/profile.container';

class ProfileComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let profile = this;
    profile.state = {}
  }

  componentDidMount(){
    this.props.retrieveProfile({user_id: this.user_id})
  }

  get user_id(){
    return parseInt(this.props.location.getIn(['params', 'user_id']))
  }

  get loaded(){
    return this.props.profile.hasIn(['data', 'user_id']) && !this.props.profile.get('loading');
  }

  get user_profile(){
    return this.props.profile.get('data')
  }

  get full_name(){
    return `${this.user_profile.get('first_name')} ${this.user_profile.get('last_name')}`;
  }

  get location(){
    return `${this.user_profile.get('city')}, ${this.user_profile.get('county')}, ${this.user_profile.get('state')}`;
  }

  render(){
    return template.call(this);
  }
}

ProfileComponent.propTypes = profilePropTypes;
ProfileComponent.NAME = 'Profile';

module.exports = profileContainer(ProfileComponent);
