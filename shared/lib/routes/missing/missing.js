/*global Promise*/

import RouteBase from './../route.base';

export default class MissingRoute extends RouteBase {

  get key(){
    return 'missing'
  }

  get route_name(){
    return 'MissingRoute';
  }

}
