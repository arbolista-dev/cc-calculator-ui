/* global module $ window document setTimeout Promise clearTimeout*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import { listLeaders, listLocations } from 'api/user.api';
import footprintContainer, { footprintPropTypes } from 'shared/containers/footprint.container';
import template from './leaders.rt.html';

const HOUSEHOLD_SIZES = [[1, '1'], [2, '2'], [0, 'Average'], [3, '3'], [4, '4'], [5, '5+']];

class LeadersComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    const leaders = this;
    leaders.state = {
      limit: 20,
      offset: 0,
      list: [],
      cache: [],
      total_count: 0,
      trigger_update: true,
      is_loading: true,
      all_loaded: false,
      selected_location: {
        city: '',
        state: '',
      },
      selected_household: undefined,
      locations: [],
      show_locations_list: false,
      show_household_list: false,
    };
  }

  componentDidMount() {
    const leaders = this;

    if (leaders.props.ui.get('show_leaders_chart')) {
      leaders.retrieveLocations();
      leaders.retrieveAndShow(0);
    }
  }

  componentWillUnmount() {
    $(document).off('click.hideLocations');
    $(document).off('click.hideHouseholdList');
  }

  render() {
    return template.call(this);
  }

  get alert_exists() {
    return this.props.ui.get('alert_exists');
  }

  get selected_location() {
    return this.state.selected_location;
  }

  get is_location_filtered() {
    if (Object.values(this.state.selected_location.city).length !== 0) {
      return true;
    }
    return false;
  }

  get list() {
    return this.state.list;
  }

  get is_loading() {
    return this.state.is_loading;
  }

  get total_count_reached() {
    if (this.state.offset === 0 && this.state.offset === 20) {
      return this.state.limit >= this.state.total_count;
    }
    return this.state.offset + this.state.limit >= this.state.total_count;
  }

  get show_locations_list() {
    return this.state.show_locations_list;
  }

  get show_household_list() {
    return this.state.show_household_list;
  }

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'leaders']).toJS();
  }

  get household_sizes() {
    return HOUSEHOLD_SIZES;
  }


  get filtered_locations() {
    return this.state.locations;
  }

  loadMoreLeaders(page) {
    this.retrieveAndShow(page*this.state.limit);
  }
  get loadMore(){
    return true;
  }

  displayLocation(location_object) {
    if (location_object.city) {
      return `${location_object.city}, ${location_object.state}`;
    }
    return '';
  }

  displayHouseholdSize(user) {
    return user.household_size === 0 ? '2.5' : user.household_size;
  }

  retrieveAndShow(offset) {
    const leaders = this;
    //leaders.props.resetAlerts();
    leaders.retrieveLeaders(offset).then(() => {
      leaders.showRetrievedLeaders();
    }).catch((err) => {
      if (err === 'total_count=0') {
        leaders.setState({
          is_loading: false,
        });

        const alert = {
          id: 'leaders',
          data: [{
            type: 'danger',
            message: leaders.t('leaders.empty'),
          }],
        };

        if (leaders.state.selected_household) alert.data[0].message = leaders.t('leaders.filtered_empty');

        leaders.props.pushAlert(alert);
      }
    });
  }

  showRetrievedLeaders() {
    const leaders = this;
    leaders.setState({
      list: leaders.state.list.concat(leaders.state.cache),
      is_loading: false,
    });
  }

  retrieveLeaders(offset) {
    const leaders = this;
    return new Promise((resolve, reject) => {
      listLeaders(leaders.state.limit, offset,
        leaders.state.selected_location.state, leaders.state.selected_household).then((res) => {
          if (res.success) {
            if (res.data.list != null) {
              leaders.setState({
                cache: res.data.list,
                total_count: res.data.total_count,
              });
            } else {
              leaders.setState({
                all_loaded: true,
                cache: []
              });
            }
            if (res.data.total_count > 0) {
              resolve();
            } else {
              reject('total_count=0');
            }
          } else {
            const alert = {
              id: 'leaders',
              data: [{
                type: 'danger',
                message: leaders.t('leaders.retrieval_error'),
              }],
            };
            leaders.props.pushAlert(alert);
            reject();
          }
        });
    });
  }

  scrollToTop() {
    window.jQuery('html, body').animate({ scrollTop: 0 }, 1000);
  }

  showHouseholdList() {
    const leaders = this;
    leaders.setState({
      show_household_list: true,
    });
  }

  showLocationsList() {
    const leaders = this;
    leaders.setState({
      show_locations_list: true,
    });
  }

  resetHousehold(event) {
    event.preventDefault();
    const leaders = this;

    leaders.setState({
      selected_household: undefined,
      show_household_list: false,
      list: [],
      limit: 20,
      offset: 0,
      total_count: 0,
      trigger_update: true,
      is_loading: true,
      all_loaded: false,
    });

    if (leaders.$household_unfilter) {
      clearTimeout(leaders.$household_unfilter);
    }

    leaders.$household_unfilter = setTimeout(() => {
      leaders.retrieveAndShow(0);
    }, 100);
  }

  resetLocation(ev) {
    ev.preventDefault();
    const leaders = this;
    const location = { city: '', state: '' };

    leaders.setState({
      selected_location: location,
      show_locations_list: false,
      list: [],
      limit: 20,
      offset: 0,
      total_count: 0,
      trigger_update: true,
      is_loading: true,
      all_loaded: false,
    });

    if (leaders.$location_unfilter) {
      clearTimeout(leaders.$location_unfilter);
    }

    leaders.$location_unfilter = setTimeout(() => {
      leaders.retrieveAndShow(0);
    }, 100);
  }

  get infinteScrollKey() {
    return this.state.selected_location.state+","+this.state.selected_household;      
  }

  setLocationFilter(event) {
    event.preventDefault();
    const leaders = this;
    const state = event.target.dataset.state;
    const location = { state };

    leaders.setState({
      selected_location: location,
      show_locations_list: false,
      list: [],
      limit: 20,
      offset: 0,
      total_count: 0,
      trigger_update: true,
      is_loading: true,
      all_loaded: false,
    });

    if (leaders.$location_filter) {
      clearTimeout(leaders.$location_filter);
    }

    leaders.$location_filter = setTimeout(() => {
      leaders.retrieveAndShow(0);
    }, 100);
  }

  setHouseholdFilter(event) {
    event.preventDefault();
    const leaders = this;
    const size = event.target.dataset.size;

    leaders.setState({
      selected_household: size,
      show_household_list: false,
      list: [],
      limit: 20,
      offset: 0,
      total_count: 0,
      trigger_update: true,
      is_loading: true,
      all_loaded: false,
    });

    if (leaders.$household_filter) {
      clearTimeout(leaders.$household_filter);
    }

    leaders.$household_filter = setTimeout(() => {
      leaders.retrieveAndShow();
    }, 100);
  }

  retrieveLocations() {
    const leaders = this;
    listLocations().then((res) => {
      if (res.success) {
        if (res.data != null) {
          let locations = [];
          Object.keys(res.data).forEach((l) => {
            locations.push(res.data[l].state);
          });
          locations = locations.filter((element, i, array) => array.indexOf(element) === i);
          if (locations.length > 1) {
            locations.sort((a, b) => {
              const locationA = a.toLowerCase();
              const locationB = b.toLowerCase();
              if (locationA < locationB) {
                return -1;
              }
              if (locationA > locationB) {
                return 1;
              }
              return 0;
            });
          }
          leaders.setState({
            locations,
          });
        } else {
          const alert = {
            id: 'leaders',
            data: [{
              type: 'danger',
              message: leaders.t('leaders.retrieval_error'),
            }],
          };
          leaders.props.pushAlert(alert);
        }
      } else {
        const alert = {
          id: 'leaders',
          data: [{
            type: 'danger',
            message: leaders.t('leaders.retrieval_error'),
          }],
        };
        leaders.props.pushAlert(alert);
      }
    });
  }

}

LeadersComponent.propTypes = footprintPropTypes;

LeadersComponent.NAME = 'Leaders';

module.exports = footprintContainer(LeadersComponent);
