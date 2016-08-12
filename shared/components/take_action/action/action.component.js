/*global module*/

import React from 'react';

import { ACTIONS_LIST } from '../take_action.component';
import Unit from './../../../lib/base_classes/unit';
import template from './action.rt.html'

class ActionComponent extends Unit {

  constructor(props, context){
    super(props, context);
    let action = this;
    action.state = {
        key: this.props.action_key,
        category: this.props.category,
        show: this.props.show,
        detailed: false
    }
  }

  get api_key(){
    return `input_takeaction_${this.state.key}`;
  }

  // @ToDo: needed?
  get result_key(){
    return `result_takeaction_${this.state.key}`;
  }

  get data(){
    let action = this;
  }

  get display_name(){
    return this.t(`actions.${this.state.category}.${this.state.key}.label`);
  }

  get content(){
    console.log('GET CONTENT for: ', this.state.key)
    let content = this.t(`actions.${this.state.category}.${this.state.key}.content`, {returnObjects: true})
    return content;
  }

  get tons_saved(){
    return this.numberWithCommas(
      Math.round(this.result_takeaction_pounds[this.state.key] * 100) / 100
    );
  }

  get result_takeaction_pounds(){
    return this.state_manager['result_takeaction_pounds'];
  }

  get result_takeaction_dollars(){
    return this.state_manager['result_takeaction_dollars'];
  }

  get result_takeaction_net10yr(){
    return this.state_manager['result_takeaction_net10yr'];
  }


  get dollars_saved(){
    return this.numberWithCommas(
      Math.round(this.result_takeaction_dollars[this.state.key]));
  }

  get upfront_cost(){
    return this.numberWithCommas(
      Math.round(this.result_takeaction_net10yr[this.state.key]));
  }

  get taken(){
    return parseInt(this.userApiValue(this.api_key)) === 1;
  }


  toggleAction(selected_action){
    let action = this,
      update = {};
    if (selected_action.taken){
      update[selected_action.api_key] = 0;
    } else {
      update[selected_action.api_key] = 1;
    }
    action.setState(update);
    action.updateTakeaction(update);
  }

  toggleActionDetails(){
    let action = this;

    let update = {},
    status = action.state.detailed;
    update['detailed'] = !status;
    action.setState(update);

    action.state.detailed = !action.state.detailed;
  }

  setInputState(id){
    let take_action = this,
    footprint = take_action.state_manager.state.user_footprint;
    return footprint[id]
  }

  displayStateContent(id){
    console.log('displayStateContent', id.includes('display_takeaction'));

    if (id.includes('display_takeaction')) {
      id = id.replace(/display_takeaction/i, 'input_takeaction')
    }
    console.log('= ', this.state_manager.state.user_footprint[id]);
    return this.state_manager.state.user_footprint[id]
  }

  updateActionInput(event){
    let action = this,
        val = event.target.value,
        id = event.target.id,
        update = {};

    update[id] = parseInt(val);
    update['input_changed'] = id;
    console.log('updateActionInput of: ', update)
    action.setState(update);
    action.updateTakeaction(update);
  }

  setSelectOptions(select) {
    if (select.type === 'vehicle') {

      console.log('Vehicle -- selectOptionValues', select)
      let options = [], i = 1;
      this.state_manager.state.vehicles.forEach((v) => {
        let vehicle = {};
        vehicle.value = i;
        vehicle.text = 'Vehicle ' + i;
        i++;
        options.push(vehicle);
      })
      return options;

    } else {
      return select.options
    }
  }

  handleChange(event){
    let i = event.target.value,
    is_vehicle = event.target.id.lastIndexOf('vehicle_select'),
    action_key = event.target.dataset.action_key;

    console.log('handleChange value: ', i)
    console.log('handleChange action key: ', action_key)
    console.log('handleChange id: ', event.target.id)

    // @ToDo: updateTakeaction first and then show results --> Air travel needs updated miles_alt state!

    if (is_vehicle > 0) this.selectVehicle(i, action_key)

    if (action_key === 'reduce_air_travel') {

      // console.log("--- miles_percent BEFORE", footprint['input_takeaction_reduce_air_travel_miles_percent'])

      let update = {};
      update['input_takeaction_reduce_air_travel_miles_percent'] = i;
      this.setState(update);
      this.updateTakeaction(update);
      // footprint['input_takeaction_reduce_air_travel_miles_percent'] = i;

      let footprint = this.state_manager.state.user_footprint;
      console.log("--- miles_percent", footprint['input_takeaction_reduce_air_travel_miles_percent'])

      console.log("footprint['result_takeaction_reduce_air_travel_miles_alt']", footprint['result_takeaction_reduce_air_travel_miles_alt'])
      // $('#result_takeaction_reduce_air_travel_miles_alt').text(footprint['result_takeaction_reduce_air_travel_miles_alt']).append(' fewer miles per year.');
    }

  }

  selectVehicle(i, action_key){
    // on update, call setState and updateTakeaction

    let footprint = this.state_manager.state.user_footprint,
    v_miles = footprint[`input_footprint_transportation_miles${i}`],
    v_mpg = footprint[`input_footprint_transportation_mpg${i}`],
    update = {};

    console.log('vehicle miles', v_miles);


    if (action_key === 'ride_my_bike' || action_key ===  'telecommute_to_work' || action_key ===  'take_public_transportation') {
      console.log("('ride_my_bike' || 'telecommute_to_work' || 'take_public_transportation'): ", action_key);

      update['input_takeaction_' + action_key + '_mpg'] = parseInt(v_mpg);
      this.setState(update);
      this.updateTakeaction(update);

    } else {

      update['input_takeaction_' + action_key + '_mpg_old'] = parseInt(v_mpg);
      update['input_takeaction_' + action_key + '_miles_old'] = parseInt(v_miles);
      this.setState(update);
      this.updateTakeaction(update);
    }

  }

  calcVehicleTotal(action_key){

    let footprint = this.state_manager.state.user_footprint,
        no_vehicles = this.state_manager.state.vehicles.length,
        total_miles = 0,
        total_mpg = 0;

    this.state_manager.state.vehicles.forEach((v) => {
      total_miles += parseInt(v.miles);
      total_mpg += parseInt(v.mpg);
    });

    if (action_key === 'practice_eco_driving') {
      footprint['result_takeaction_practice_eco_driving_dispmiles'] = total_miles;
      $('#result_takeaction_practice_eco_driving_dispmiles').text(total_miles).append(' ' + this.t(`travel.miles_abbr`));
      footprint['result_takeaction_practice_eco_driving_mpg'] = total_mpg / no_vehicles;
      $('#result_takeaction_practice_eco_driving_mpg').text(total_mpg / no_vehicles).append(' ' + this.t(`travel.miles_per_gallon`));

      let newmpg = 'result_takeaction_practice_eco_driving_newmpg',
          galsaved = 'result_takeaction_practice_eco_driving_galsaved';

      $('#' + newmpg).text(Math.round(footprint[newmpg])).append(' ' + this.t(`travel.miles_per_gallon`));
      $('#' + galsaved).text(Math.round(footprint[galsaved])).append(' ' + this.t(`travel.gallons_per_year`));

    } else {
      $('#result_takeaction_maintain_my_vehicles_dispmiles').text(total_miles).append(' ' + this.t(`travel.miles_abbr`));
      $('#result_takeaction_maintain_my_vehicles_mpg').text(total_mpg / no_vehicles).append(' ' + this.t(`travel.miles_per_gallon`));

    }
  }

  getAirTotal(){
    let footprint = this.state_manager.state.user_footprint;

    $('#result_takeaction_reduce_air_travel_totalmiles').text(footprint['result_takeaction_reduce_air_travel_totalmiles']).append(' ' + this.t(`travel.miles_per_year`));
    $('#result_takeaction_reduce_air_travel_pounds_from_flight').text(footprint['result_takeaction_reduce_air_travel_pounds_from_flight']).append(' ' + this.t(`travel.co2_per_year`));
  }

  componentDidMount(){
    if (this.category === 'transportation') this.selectVehicle(1, this.key);
    if (this.key === 'practice_eco_driving' || this.key === 'maintain_my_vehicles') this.calcVehicleTotal(this.key);
    if (this.key === 'reduce_air_travel') this.getAirTotal();
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   console.log('--- state', this.state);
  //   console.log('--- nextState', nextState);
  //   // if (nextState.updated === true) {
  //   //   let update = {};
  //   //   update['updated'] = false;
  //   //   this.setState(update);
  //   //   return true
  //   // } else {
  //   //   false
  //   // }
  //   console.log('shouldComponentUpdate: ');
  //   console.log('nextState.show === this.state.show', nextState.show === this.state.show);
  //   console.log('nextState.detailed === this.state.detailed', nextState.detailed === this.state.detailed);
  //   console.log('nextState.length === this.state.length', nextState.length === this.state.length);
  //   // if ((nextState.show === this.state.show) && (nextState.detailed === this.state.detailed) && (nextState.length === this.state.length)) {
  //   //   return false
  //   // } else {
  //   //   return true
  //   // }
  //   return true
  // }


  render(){
    return template.call(this);
  }

}

ActionComponent.propTypes = {
  action_key: React.PropTypes.string.isRequired,
  category: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool.isRequired
};

ActionComponent.NAME = 'Action';

module.exports = ActionComponent;
