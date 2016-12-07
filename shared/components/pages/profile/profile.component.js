/*global module window $*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './profile.rt.html';
import { setPhoto } from 'api/user.api';
import profileContainer from 'shared/containers/profile.container';
import { profilePropTypes } from 'shared/containers/profile.container';


class ProfileComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let profile = this;
    profile.state = {
      uploaded_photo_src: '',
      file_selected: false
    }
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

  get photo_url(){
    return this.state.uploaded_photo_src ? this.state.uploaded_photo_src : this.user_profile.get('photo_url');
  }

  get location(){
    return `${this.user_profile.get('city')}, ${this.user_profile.get('county')}, ${this.user_profile.get('state')}`;
  }

  get show_upload_hover(){
    return this.state.file_selected;
  }

  get is_own_editable_profile(){
    return this.user_authenticated && (this.user_profile.get('user_id') === this.props.auth.getIn(['data', 'user_id']))
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

  selectedFile(){
    this.setState({
      file_selected: true
    })
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

  uploadPhoto(event){
    event.preventDefault();
    const profile = this;
    const files = document.getElementById('user-photo-upload').files;
    const formData = new FormData();

    if (files.length > 0) {

      if (files[0] instanceof File) {
        formData.append('file', files[0]);
        const token = profile.props.auth.getIn(['data', 'token']);
        setPhoto(formData, token).then((res) => {
          console.log('res', res);
          profile.setState({
            uploaded_photo_src: res.data.photo_url,
            file_selected: false
          })
        })
      }
    }
  }
}

ProfileComponent.propTypes = profilePropTypes;
ProfileComponent.NAME = 'Profile';

module.exports = profileContainer(ProfileComponent);
