/* global window $*/

import { retrieveProfile } from 'shared/reducers/profile/profile.actions';
import mixin from '../mixin';
import Translatable from './translatable';
import footprintable from '../mixins/footprintable';
import resizable from '../mixins/resizable';
import { tokenIsValid } from '../utils/utils';

const MAX_SLIDER_WIDTH = 600;
const MIN_SLIDER_WIDTH = 250;

const ACTIONS = [{
  id: 'transportation',
  title: 'Transportation',
  keys: ['more_efficient_vehicle', 'alternativefuel_vehicle', 'electric_vehicle', 'hybrid_vehicle', 'telecommute_to_work', 'ride_my_bike', 'take_public_transportation', 'practice_eco_driving', 'maintain_my_vehicles', 'carpool_to_work', 'reduce_air_travel'],
}, {
  id: 'housing',
  title: 'Housing',
  keys: ['switch_to_cfl', 'turn_off_lights', 'T12toT8', 'tankless_water_heater', 'thermostat_winter', 'thermostat_summer', 'purchase_high_efficiency_cooling', 'purchase_high_efficiency_heating', 'energy_star_fridge', 'energy_star_printers', 'energy_star_copiers', 'energy_star_desktops', 'rechargeable_batteries', 'power_mgmt_comp', 'purchase_green_electricity', 'install_PV_panels', 'install_solar_heating', 'low_flow_showerheads', 'low_flow_faucets', 'low_flow_toilet', 'line_dry_clothing', 'water_efficient_landscaping', 'plant_trees', 'reduce_comm_waste', 'print_double_sided'],
}, {
  id: 'shopping',
  title: 'Shopping',
  keys: ['low_carbon_diet', 'go_organic'],
}];

export default class Panel extends mixin(Translatable, footprintable, resizable) {

  get route_key() {
    return this.router.current_route.key;
  }

  get current_route_name() {
    return this.props.location.get('route_name');
  }

  get user_authenticated() {
    if (this.props.auth.hasIn(['data', 'token'])) {
      return tokenIsValid(this.props.auth.getIn(['data', 'token']));
    }
    return false;
  }

  get slider_width() {
    let width = window.innerWidth * 0.8;
    width = Math.min(MAX_SLIDER_WIDTH, width);
    width = Math.max(MIN_SLIDER_WIDTH, width);
    return width;
  }

  get connect_to_api() {
    return this.props.ui.get('connect_to_api');
  }

  get actions_by_category() {
    return ACTIONS;
  }

  getCategoryByAction(action_key) {
    let id;
    this.actions_by_category.forEach((category) => {
      if (category.keys.includes(action_key)) {
        id = category.id;
      }
    });
    return id;
  }

  pushRoute(route_name, action, payload) {
    this.router.pushRoute(route_name, action, payload);
  }

  toggleLeadersChart() {
    const component = this;
    const ui = {
      id: 'show_leaders_chart',
      data: true,
    };

    component.props.updateUI(ui);
    window.jQuery('html, body').animate({ scrollTop: $('.cc_leaders').offset().top }, 1000);
  }

  goToProfile(user_id) {
    this.pushRoute('Profile', retrieveProfile, { user_id });
  }

  setUserAnswersToDefault(show_alert) {
    const component = this;
    const init = true;

    component.resetUserFootprint();

    const default_inputs = component.getDefaultInputs(init);
    component.props.ensureDefaults(default_inputs);

    if (show_alert) {
      const alert = {
        id: 'shared',
        data: [{
          type: 'success',
          message: component.t('success.answers_reset'),
        }],
      };
      component.props.pushAlert(alert);
    }
  }

  routeComponent(route_name) {
    return route_name === this.constructor.NAME;
  }
}
