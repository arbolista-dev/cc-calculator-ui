/*global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './sign_up.rt.html';
import CalculatorApi from 'api/calculator.api';
import { validateParameter } from 'shared/lib/utils/utils';
import authContainer from 'shared/containers/auth.container';
import { authPropTypes } from 'shared/containers/auth.container';

const INPUT_STATE = [
  'first_name',
  'last_name',
  'email',
  'password',
  'answers',
  'location',
  'public'];

class SignUpComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let sign_up = this;
    sign_up.valid = {
      first_name: false,
      last_name: false,
      email: false,
      password: false,
      input_location: false
    };
    sign_up.state = {
      locations: {},
      show_location_suggestions: false,
      input_location: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      answers: '',
      city: '',
      location: {},
      public: true
    };
  }

  render() {
    return template.call(this);
  }

  get alert_list() {
    return  this.props.ui.getIn(['alerts', 'sign_up']).toJS();
  }

  get show_location_suggestions(){
    return this.state.show_location_suggestions;
  }

  get input_location_display(){
    return this.state.input_location;
  }

  paramValid(param){
    let sign_up = this;

    if(sign_up.state[param].length > 0) {
      return sign_up.valid[param];
    } else {
      return true;
    }
  }

  validateAll(){
    let sign_up = this,
        all_valid = Object.values(sign_up.valid).filter(item => item === false);
    if (all_valid.length>0) {
      let alerts = {
        id: 'sign_up',
        data: []
      };
      for (let key in sign_up.valid) {
        if (sign_up.valid[key] === false) {
          let item = {
            type: 'danger',
            message: sign_up.t('sign_up.' + key) + ' ' + sign_up.t('errors.invalid')
          };
          alerts.data.push(item)
        }
      }
      sign_up.props.pushAlert(alerts)
      return false;
    }
    return true;
  }

  updateInput(event) {
    event.preventDefault();

    let sign_up = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };

    sign_up.valid[api_key] = validateParameter(update);
    sign_up.setState(update);
  }

  updateCheckbox() {
    this.setState({
      public: !this.state.public
    })
  }

  submitSignup(event) {
    let sign_up = this;
    event.preventDefault();
    if (sign_up.validateAll()) {
      let state_input = {
        first_name: sign_up.state.first_name,
        last_name: sign_up.state.last_name,
        email: sign_up.state.email,
        password: sign_up.state.password,
        answers: sign_up.state.answers,
        city: sign_up.state.location.city,
        county: sign_up.state.location.county,
        state: sign_up.state.location.state,
        country: 'us',
        public: sign_up.state.public
      }
      sign_up.props.signup(state_input);
    }
  }

  // called when location suggestion is clicked.
  setLocation(event){
    let sign_up = this,
        zipcode = event.target.dataset.zipcode,
        suggestion = event.target.dataset.suggestion;

    let index = sign_up.state.locations.data.findIndex(l => l === zipcode),
        location_data = sign_up.state.locations.selected_location[index];

    sign_up.setState({
      show_location_suggestions: false,
      input_location: suggestion,
      location: location_data
    });

    sign_up.valid.input_location = true;
  }

  setLocationSuggestions(event){
    let sign_up = this,
        new_location = {
          input_location_mode: 2,
          input_location: event.target.value
        };

    sign_up.setState({
      input_location: event.target.value,
      show_location_suggestions: true
    });

    if (sign_up.$set_location_suggestions){
      clearTimeout(sign_up.$set_location_suggestions);
    }

    // debounce location suggestions by 500ms.
    sign_up.$set_location_suggestions = setTimeout(()=>{
      CalculatorApi.getAutoComplete(new_location)
        .then((locations)=>{
          sign_up.setState({
            locations: locations,
            show_location_suggestions: true
          });
        });
    }, 500);
  }

  showLocationSuggestions(){
    this.setState({
      show_location_suggestions: true
    });
  }

  hideLocationSuggestions(){
    this.setState({
      show_location_suggestions: false
    });
  }
}

SignUpComponent.NAME = 'SignUp';
SignUpComponent.propTypes = authPropTypes;

module.exports = authContainer(SignUpComponent);
