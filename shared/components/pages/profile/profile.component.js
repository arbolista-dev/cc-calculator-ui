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

  render(){
    return template.call(this);
  }

  get user_id(){
    return parseInt(this.props.location.getIn(['params', 'user_id']))
  }

  get loaded(){
    return !this.props.profile.get('loading') && !this.error;
  }

  get error(){
    return this.props.profile.get('load_error');
  }

  get user_profile(){
    return this.props.profile.get('data');
  }

  get full_name(){
    return `${this.user_profile.get('first_name')} ${this.user_profile.get('last_name')}`;
  }

  get location(){
    return `${this.user_profile.get('city')}, ${this.user_profile.get('county')}, ${this.user_profile.get('state')}`;
  }

  get profile_footprint(){
    if (this.loaded) {
      try {
        return JSON.parse(this.user_profile.get('total_footprint'))
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  }

  viewRanking(){
    let profile = this,
        ui = {
          id: 'show_leaders_chart',
          data: true
        };

    profile.props.updateUI(ui);
    profile.router.goToRouteByName('Footprint');
  }
}

ProfileComponent.propTypes = profilePropTypes;
ProfileComponent.NAME = 'Profile';

module.exports = profileContainer(ProfileComponent);
