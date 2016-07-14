/*global module*/

import React from 'react';

import Translatable from './../../lib/base_classes/translatable';
import template from './<%= componentNameLowerCase %>.rt.html'

class <%=  componentNameCamelCase %>Component extends Translatable {

  constructor(props, context){
    super(props, context);
    let <%=  componentNameLowerCase %> = this;
    <%=  componentNameLowerCase %>.state = {}
  }

  get state_manager() {
    return this.props.state_manager;
  }

  get route_key() {
    return this.state_manager.state.route.key;
  }

  get title() {
    return this.t('<%=  componentNameLowerCase %>.title');
  }

  componentDidMount() {
    let <%=  componentNameLowerCase %> = this;
  }

  updateResults(){
    let <%=  componentNameLowerCase %> = this;
  }

  render(){
    return template.call(this);
  }

}

<%=  componentNameCamelCase %>Component.propTypes = {

};

<%=  componentNameCamelCase %>Component.NAME = '<%=  componentNameCamelCase %>';

module.exports = <%=  componentNameCamelCase %>Component;
