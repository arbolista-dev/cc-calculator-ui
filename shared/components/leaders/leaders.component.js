/*global module*/

import React from 'react';

import { listLeaders } from 'api/user.api';
import Panel from './../../lib/base_classes/panel';
import template from './leaders.rt.html';

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
      is_loading: false,
      all_loaded: false
    }
  }

  get list(){
    return this.state.list;
  }

  get footprint_identifier() {
    let leaders = this;
    switch (leaders.current_route_name){
      case 'Travel':
        return 'result_transport_total';
        break;
      case 'Home':
        return 'result_housing_total';
        break;
      case 'Food':
        return 'result_food_total';
        break;
      case 'Shopping':
        return ['result_services_total', 'result_goods_total'];
        break;
      default:
        return 'result_grand_total';
        break;
    }
  }

  get show_chart(){
    return this.state.show_leaders_chart;
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

  componentDidMount() {
    let leaders = this;
    leaders.retrieveLeaders().then(() => {
      leaders.showRetrievedLeaders();
      if (!leaders.total_count_reached) leaders.detectScroll();
    }).catch((err) => {
      if (err === "total_count=0") {
        leaders.state_manager.state.alerts.push({type: 'danger', message: leaders.t('leaders.empty')});
        leaders.state_manager.syncLayout();
      }
    });
  }

  filterCategoryFootprint() {
    let leaders = this,
    id = this.footprint_identifier;

    leaders.state.cache.forEach((leader) => {
      Object.keys(leader.total_footprint).forEach(function (key) {
        if (Array.isArray(id)) {
          leader['footprint'] = parseFloat(leader.total_footprint[id[0]]) + parseFloat(leader.total_footprint[id[1]])
        } else {
          if (key === id) {
            leader['footprint'] = leader.total_footprint[key];
          }
        }
      });
    })
  }

  showRetrievedLeaders() {
    let leaders = this;
    leaders.setState({
      list: leaders.state.cache,
      is_loading: false
    })
  }

  detectScroll() {
    let leaders = this;
    $(window).scroll(function(){
      let window_top = $(window).scrollTop(), doc_height = $(document).height(), window_height = $(window).height(), scrolltrigger = 0.95;

      leaders.setState({
        scrolled: (window_top/(doc_height-window_height))*100,
      })

      if (leaders.state.scrolled >= 75 && leaders.state.trigger_update && !leaders.total_count_reached && !leaders.state.all_loaded) {
        leaders.setState({
          offset: leaders.state.offset + 20,
          is_loading: true,
          trigger_update: false
        })

        setTimeout(function() {
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
    let leaders = this;
    return new Promise((resolve, reject) => {
      listLeaders(leaders.state.limit, leaders.state.offset).then((res) => {
        if (res.success) {
          if (res.data.list != null) {
            leaders.setState({
              cache: leaders.state.cache.concat(res.data.list),
              total_count: res.data.total_count
            });
            leaders.filterCategoryFootprint();
          } else {
            leaders.setState({
              all_loaded: true
            });
          }
          if (res.data.total_count > 0) {
            resolve();
          } else {
            reject("total_count=0");
          }
        } else {
          leaders.state_manager.state.alerts.push({type: 'danger', message: leaders.t('leaders.retrieval_error')});
          leaders.state_manager.syncLayout();
          reject();
        }
      })
    })
  }

  scrollToTop(){
    window.jQuery("html, body").animate({ scrollTop:0 }, 1000);
  }

  render(){
    return template.call(this);
  }
}

LeadersComponent.NAME = 'Leaders';

module.exports = LeadersComponent;
