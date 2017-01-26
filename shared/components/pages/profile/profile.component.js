/* global module document FormData File */

import React from 'react';
import { Map } from 'immutable';
import Panel from 'shared/lib/base_classes/panel';
import { setPhoto, updateUser, updateUserGoals } from 'api/user.api';
import profileContainer, { profilePropTypes } from 'shared/containers/profile.container';
import template from './profile.rt.html';

const SOCIAL_MEDIA_PLATFORMS = [
  'facebook', 'twitter', 'instagram', 'linkedin', 'medium',
];

class ProfileComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const profile = this;
    profile.state = {
      uploaded_photo_src: '',
      file_selected: false,
      profile_edit_active: false,
      remote_profile_loaded: false,
      is_loading: false,
    };
  }

  componentDidMount() {
    this.props.retrieveProfile({ user_id: this.user_id, token: this.props.auth.getIn(['data', 'token']) });
  }

  componentDidUpdate() {
    if (this.loaded && !this.state.remote_profile_loaded) this.checkRemoteProfileData();
  }

  render() {
    return template.call(this);
  }

  get user_id() {
    return parseInt(this.props.location.getIn(['params', 'user_id']), 10);
  }

  get loaded() {
    return !this.props.profile.get('loading') && !this.error;
  }

  get error() {
    return this.props.profile.get('load_error');
  }

  get user_profile() {
    return this.props.profile.get('data');
  }

  get full_name() {
    return `${this.user_profile.get('first_name')} ${this.user_profile.get('last_name')}`;
  }

  get photo_url() {
    return this.state.uploaded_photo_src ? this.state.uploaded_photo_src : this.user_profile.get('photo_url');
  }

  get location() {
    return `${this.user_profile.get('city')}, ${this.user_profile.get('county')}, ${this.user_profile.get('state')}`;
  }

  get social_media_platforms() {
    return SOCIAL_MEDIA_PLATFORMS;
  }

  get profile_data() {
    return this.user_profile.get('profile_data');
  }

  get user_goals() {
    if (this.user_profile.has('user_goals')) {
      let user_goals = this.user_profile.get('user_goals').toJS();
      user_goals = user_goals.filter(key => key.status !== 'not_relevant');
      return user_goals.sort((a, b) => {
        if (a.status === 'completed') {
          return -1;
        }
        if (b.status === 'completed') {
          return 1;
        }
        return 0;
      });
    }
    return [];
  }

  get is_public() {
    return this.state.privacy_changed ? this.state.public : this.user_profile.get('public');
  }

  get show_upload_hover() {
    return this.state.file_selected;
  }

  get is_loading() {
    return this.state.is_loading;
  }

  get is_own_editable_profile() {
    return this.user_authenticated && (this.user_profile.get('user_id') === this.props.auth.getIn(['data', 'user_id']));
  }

  get profile_footprint() {
    if (this.loaded) {
      try {
        return JSON.parse(this.user_profile.get('total_footprint'));
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  }

  checkRemoteProfileData() {
    if (this.profile_data && Map.isMap(this.profile_data)) {
      const profile_data = Object.assign({}, this.profile_data.toJS(), {
        remote_profile_loaded: true,
      });
      this.setState(profile_data);
    }
  }

  getProfileData(type) {
    return this.state[type];
  }

  getProfileLink(type) {
    return `${this.getProfilePrefix(type)}${this.state[type]}`;
  }

  getProfilePrefix(type) {
    switch (type) {
      case 'facebook':
        return 'http://facebook.com/';
      case 'twitter':
        return 'http://twitter.com/';
      case 'instagram':
        return 'http://instagram.com/';
      case 'linkedin':
        return 'http://linkedin.com/';
      case 'medium':
        return 'http://medium.com/';
      default:
        break;
    }
    return '';
  }

  selectedFile() {
    this.setState({
      file_selected: true,
    });
  }

  triggerEdit() {
    this.setState({
      profile_edit_active: true,
    });
  }

  updateInput(event) {
    this.setState({
      [event.target.dataset.key]: event.target.value,
    });
  }

  viewRanking() {
    const profile = this;
    const ui = {
      id: 'show_leaders_chart',
      data: true,
    };

    profile.props.updateUI(ui);
    profile.router.goToRouteByName('Footprint');
  }

  displayActionTitle(key) {
    return this.t(`actions.${key}.label`);
  }

  getCategoryIcon(key) {
    const category = this.getCategoryByAction(key);
    if (category === 'transportation') {
      return 'bicycle';
    } else if (category === 'housing') {
      return 'home';
    }
    return 'cutlery';
  }

  displayActionDollarsSaved(dollars_saved) {
    return this.numberWithCommas(dollars_saved);
  }

  displayActionUpfrontCost(upfront_cost) {
    return this.numberWithCommas(upfront_cost);
  }

  toggleActionComplete(action) {
    const updated_status = action.status === 'completed' ? 'pledged' : 'completed';
    const update = {
      key: action.key,
      status: updated_status,
      details: {
        tons_saved: parseFloat(action.tons_saved),
        dollars_saved: parseFloat(action.dollars_saved),
        upfront_cost: parseFloat(action.upfront_cost),
      },
    };
    this.updateRemoteUserActions(update);
  }

  updateRemoteUserActions(update) {
    const token = this.props.auth.getIn(['data', 'token']);
    if (this.user_authenticated) {
      updateUserGoals(update, token).then(() => {
        this.props.retrieveProfile({ user_id: this.user_id, token: this.props.auth.getIn(['data', 'token']) });
      });
    }
  }

  uploadPhoto(event) {
    event.preventDefault();
    const profile = this;
    const files = document.getElementById('user-photo-upload').files;
    const formData = new FormData();

    if (files.length > 0) {
      if (files[0] instanceof File) {
        profile.setState({
          is_loading: true,
        });
        formData.append('file', files[0]);
        const token = profile.props.auth.getIn(['data', 'token']);
        setPhoto(formData, token).then((res) => {
          profile.setState({
            uploaded_photo_src: res.data.photo_url,
            file_selected: false,
            is_loading: false,
          });
        });
      }
    }
  }

  updatePrivacy() {
    const token = this.props.auth.getIn(['data', 'token']);
    const is_public = this.state.privacy_changed ? !this.state.public : !this.user_profile.get('public');

    this.setState({
      public: !this.state.public,
      privacy_changed: true,
    });

    updateUser({ public: toString(is_public) }, token);
  }

  updateProfile() {
    const profile = this;
    const token = profile.props.auth.getIn(['data', 'token']);
    const data = {
      facebook: this.state.facebook,
      twitter: this.state.twitter,
      instagram: this.state.instagram,
      linkedin: this.state.linkedin,
      medium: this.state.medium,
      intro: this.state.intro,
    };

    profile.setState({
      is_loading: true,
    });

    updateUser({ profile_data: data }, token).then(() => {
      profile.setState({
        profile_edit_active: false,
        is_loading: false,
        privacy_changed: false,
      });
      profile.props.retrieveProfile({ user_id: this.user_id });
    });
  }

}

ProfileComponent.propTypes = profilePropTypes;
ProfileComponent.NAME = 'Profile';

module.exports = profileContainer(ProfileComponent);
