/*global window*/

import queryString from 'query-string';
import extend from 'extend';

import { updateLocation } from 'shared/reducers/location/location.actions';
import { defineRoutes } from '../routes';

const NON_MAIN_ROUTES = ['Settings', 'MissingRoute', 'ForgotPassword'];

const DEFAULT_UPDATE_LOCATION_ACTION = {
  type: updateLocation.getType(),
  payload: {}
};

export default class Router {

  constructor(i18n, routes) {
    let router = this;

    router.i18n = i18n;
    router.routes = routes || Router.routes(i18n);

    router.update_in_progress = true;
  }

  get default_update_location_action(){
    return extend(true, {}, DEFAULT_UPDATE_LOCATION_ACTION);
  }

  get current_route(){
    return this.findRoute(Router.currentWindowLocation().pathname);
  }

  get main_routes(){
    return this.routes.filter((route)=>{
      return  NON_MAIN_ROUTES.indexOf(route.route_name) < 0;
    })
  }

  get locale(){
    return Router.locale();
  }

  shouldUpdateCurrentRoute(location){
    let router = this;
    return !router.current_route || !router.current_route.matchesLocation(location.pathname);
  }

  initializeHistory(createHistory, store){
    let router = this;
    router.history = createHistory();
    router.history.listen(router.onLocationChange.bind(router, store));
  }

  findRoute(pathname){
    let router = this;
    return router.routes.find((route) => {
      return route.matchesLocation(pathname);
    });
  }

  parseLocation(new_location){
    let route = this.findRoute(new_location.pathname),
        location = {
          pathname: new_location.pathname,
          query: queryString.parse(new_location.search)
        };
    location.route_name = route.route_name;
    location.params = route.parseParams(location);
    return location;
  }

  // Changing Route

  // this will cause onLocationChange to fire with
  // the new location.

  pushRoute(route_name, action, payload){
    let router = this,
        route = router.routes.getRoute(route_name);

    action = {
      type: action ? action.getType() : updateLocation.getType(),
      payload: payload,
      no_scroll: payload ? payload.no_scroll : false
    };

    router.pushHistory({
      pathname: route.url(action, router.i18n),
      state: action
    });
  }


  pushHistory(location){
    this.history.push(location);
  }

  next(){
    let router = this,
      current_i = router.routes.indexOf(router.current_route),
      next_route = router.routes[current_i + 1];
      return router.pushRoute(next_route.route_name);
  }

  previous(){
    let router = this,
      current_i = router.routes.indexOf(router.current_route),
      next_route = router.routes[current_i - 1];
      return router.pushRoute(next_route.route_name);
  }

  onLocationChange(store, new_location){
    let router = this;

    if (new_location.action !== 'PUSH') return false;
    if (router.scrollForNewLocation(new_location)) router.scrollToTop();

    let action = extend(true, {payload: {}}, new_location.state) ||  this.default_update_location_action;

    action.payload['location'] = this.parseLocation(new_location);
    store.dispatch(action);
  }

  scrollForNewLocation(location){
    return !location.state || !location.state.no_scroll;
  }

  scrollToTop(){
    window.jQuery("html, body").animate({ scrollTop: 0 }, "slow");
  }

  static currentWindowLocation(){
    let pathname = window.location.pathname,
        query = window.location.search;
    return { pathname: pathname, query: query };
  }

  // Use this when createHistory is a hash history
  static currentHashLocation(){
    let hash = window.location.hash,
    match = hash.match(/^#([^\?]+)(\?.+)?/);
    return {
      pathname: match ? match[1] : '',
      query: match && match[2] ? match[2] : ''
    }
  }

  static locale(){
    let pathname = window.location.pathname,
        match = pathname.match(new RegExp('^\/?(\\w{2})(\/|$)'));

    if (!match){ return 'en'; }
    return match[1];
  }

  static routes(i18n){
    return defineRoutes(i18n);
  }

}
