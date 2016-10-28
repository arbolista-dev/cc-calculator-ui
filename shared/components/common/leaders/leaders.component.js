/*global module $ window document setTimeout Promise clearTimeout*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './leaders.rt.html';
import { listLeaders, listLocations } from 'api/user.api';
import footprintContainer from 'shared/containers/footprint.container';
import { footprintPropTypes } from 'shared/containers/footprint.container';

class LeadersComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let leaders = this;
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
        state: ''
      },
      locations: [],
      show_locations_list: false
    }
  }

  componentDidMount() {
    let leaders = this;

    if (leaders.props.ui.getIn(['leaders_chart', 'show'])) {
      leaders.retrieveLocations();
      leaders.retrieveAndShow();
    }

    let ui = {
      id: 'leaders_chart',
      data: {
        category: leaders.current_route_name
      }
    };

    leaders.props.updateUI(ui);
  }

  componentDidUpdate() {
    let leaders = this;

    if (leaders.props.ui.getIn(['leaders_chart', 'category']) != leaders.current_route_name) {
      let ui = {
        id: 'leaders_chart',
        data: {
          category: leaders.current_route_name,
          show: false
        }
      };
      leaders.props.updateUI(ui);
      $(window).off('scroll', leaders.detectScroll());
    }
  }

  componentWillUnmount(){
    $(window).off('scroll', this.detectScroll());
    $(document).off('click.hideLocations');
  }

  render(){
    return template.call(this);
  }

  get category_identifier() {
    let leaders = this,
        id;
    switch (leaders.current_route_name){
    case 'Travel':
      id = 'result_transport_total';
      break;
    case 'Home':
      id = 'result_housing_total';
      break;
    case 'Food':
      id = 'result_food_total';
      break;
    case 'Shopping':
      id = 'result_shopping_total';
      break;
    default:
      id = 'result_grand_total';
      break;
    }
    return id;
  }

  get selected_location() {
    if (this.is_location_filtered) {
      return this.state.selected_location
    }
  }

  get is_location_filtered() {
    if (Object.values(this.state.selected_location.city).length != 0) {
      return true;
    } else {
      return false;
    }
  }

  get list(){
    return this.state.list;
  }

  get is_loading(){
    return this.state.is_loading;
  }

  get footprint_title(){
    let leaders = this,
        title;
    switch (leaders.current_route_name){
    case 'Travel':
      title = leaders.t('leaders.travel_footprint');
      break;
    case 'Home':
      title = leaders.t('leaders.home_footprint');
      break;
    case 'Food':
      title = leaders.t('leaders.food_footprint');
      break;
    case 'Shopping':
      title = leaders.t('leaders.shopping_footprint');
      break;
    default:
      title = leaders.t('leaders.total_footprint');
      break;
    }
    return title;
  }

  get total_count_reached(){
    if (this.state.offset === 0 && this.state.offset === 20) {
      return this.state.limit >= this.state.total_count
    } else {
      return this.state.offset + this.state.limit >= this.state.total_count;
    }
  }

  get show_locations_list() {
    return this.state.show_locations_list;
  }

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'leaders']).toJS()
  }

  get filtered_locations(){
    return this.state.locations.filter(location=>  !!location.city)
  }

  displayLocation(location_object){
    if (location_object.city){
      return `${location_object.city}, ${location_object.state}`
    }
    return '';
  }

  retrieveAndShow(){
    let leaders = this;
    leaders.retrieveLeaders().then(() => {
      leaders.showRetrievedLeaders();
      if (!leaders.total_count_reached) $(window).scroll(leaders.detectScroll());
    }).catch((err) => {
      if (err === 'total_count=0') {
        leaders.setState({
          is_loading: false
        })

        let alert = {
          id: 'leaders',
          data: [{
            type: 'danger',
            message: leaders.t('leaders.empty')
          }]
        };
        leaders.props.pushAlert(alert);
      }
    });
  }

  showRetrievedLeaders() {
    let leaders = this;
    leaders.setState({
      list: leaders.state.list.concat(leaders.state.cache),
      is_loading: false
    })
  }

  detectScroll() {
    let leaders = this;
    $(window).scroll(()=>{
      let window_top = $(window).scrollTop(), doc_height = $(document).height(), window_height = $(window).height();
      leaders.setState({
        scrolled: (window_top/(doc_height-window_height))*100
      })
      if (leaders.state.scrolled >= 75 && leaders.state.trigger_update && !leaders.total_count_reached && !leaders.state.all_loaded) {
        leaders.setState({
          offset: leaders.state.offset + 20,
          is_loading: true,
          trigger_update: false
        })

        setTimeout(()=>{
          leaders.retrieveLeaders().then(() => {
            leaders.showRetrievedLeaders();
            leaders.setState({
              trigger_update: true
            })
          });
        }, 1000);
      }
    });
  }

  retrieveLeaders() {
    let leaders = this,
        category = leaders.props.ui.getIn(['leaders_chart', 'category']);
    return new Promise((resolve, reject) => {
      listLeaders(leaders.state.limit, leaders.state.offset, category, leaders.state.selected_location.city, leaders.state.selected_location.state).then((res) => {
        if (res.success) {
          if (res.data.list != null) {
            leaders.setState({
              cache: res.data.list,
              total_count: res.data.total_count
            });
          } else {
            leaders.setState({
              all_loaded: true
            });
          }
          if (res.data.total_count > 0) {
            resolve();
          } else {
            reject('total_count=0');
          }
        } else {
          let alert = {
            id: 'leaders',
            data: [{
              type: 'danger',
              message: leaders.t('leaders.retrieval_error')
            }]
          };
          leaders.props.pushAlert(alert);
          reject();
        }
      })
    })
  }

  scrollToTop(){
    window.jQuery('html, body').animate({ scrollTop:0 }, 1000);
  }

  showLocationsList() {
    let leaders = this;
    leaders.setState({
      show_locations_list: true
    });

    $(document).on('click.hideLocations', (event)=>{
      if (!$(event.target).closest('#leaders_locations_list').length) {
        leaders.setState({
          show_locations_list: false
        })
      }
    });
  }

  resetLocation(){
    let leaders = this,
        location = { city: '', state: ''};

    leaders.setState({
      selected_location: location,
      show_locations_list: false,
      list: [],
      limit: 20,
      offset: 0,
      total_count: 0,
      trigger_update: true,
      is_loading: true,
      all_loaded: false
    });

    if (leaders.$location_unfilter) {
      clearTimeout(leaders.$location_unfilter);
    }

    leaders.$location_unfilter = setTimeout(()=>{
      leaders.retrieveAndShow();
    }, 100);
  }

  setLocation(event){
    let leaders = this,
        city = event.target.dataset.city,
        state = event.target.dataset.state,
        location = { city: city, state: state};

    leaders.setState({
      selected_location: location,
      show_locations_list: false,
      list: [],
      limit: 20,
      offset: 0,
      total_count: 0,
      trigger_update: true,
      is_loading: true,
      all_loaded: false
    });

    if (leaders.$location_filter) {
      clearTimeout(leaders.$location_filter);
    }

    leaders.$location_filter = setTimeout(()=>{
      leaders.retrieveAndShow();
    }, 100);
  }

  retrieveLocations() {
    let leaders = this;
    listLocations().then((res) => {
      if (res.success) {
        if (res.data != null) {
          let locations = res.data;
          locations.sort((a, b) => {
            let locationA = a.state.toLowerCase(), locationB = b.state.toLowerCase();
            if (locationA < locationB)
              return -1
            if (locationA > locationB)
              return 1
            return 0
          });
          leaders.setState({
            locations: locations
          });
        } else {
          let alert = {
            id: 'leaders',
            data: [{
              type: 'danger',
              message: leaders.t('leaders.retrieval_error')
            }]
          };
          leaders.props.pushAlert(alert);
        }
      } else {
        let alert = {
          id: 'leaders',
          data: [{
            type: 'danger',
            message: leaders.t('leaders.retrieval_error')
          }]
        };
        leaders.props.pushAlert(alert);
      }
    });
  }
}

LeadersComponent.propTypes = footprintPropTypes;

LeadersComponent.NAME = 'Leaders';

module.exports = footprintContainer(LeadersComponent);
