/*global module*/

import React from 'react';

import { listLeaders } from 'api/user.api';
import Panel from './../../lib/base_classes/panel';
import template from './leaders.rt.html'

class LeadersComponent extends Panel {

  constructor(props, context){
    super(props, context);
    let leaders = this;
    leaders.state = {
      limit: 10,
      offset: 0,
      list: []
    }
  }

  get list(){
    return this.state.list;
  }

  componentDidMount() {
    let leaders = this;
    leaders.retrieveLeadersList();
  }

  retrieveLeadersList() {
    let leaders = this;

    listLeaders(leaders.state.limit, leaders.state.offset).then((res) => {
      if (res.success) {
        leaders.setState({
          list: res.data
        });
        console.log('leaders list', leaders.state.list);
      } else {
        leaders.state_manager.state.alerts.push({type: 'danger', message: leaders.t('leaders.retrieval_error')});
      }
    })
  }

  render(){
    return template.call(this);
  }

}

LeadersComponent.propTypes = {

};

LeadersComponent.NAME = 'Leaders';

module.exports = LeadersComponent;
