/*global window*/

import queryString from 'query-string';
import {defineRoutes} from '../routes';

export default class Router {

  constructor(state_manager, i18n) {
    let router = this;

    router.routes = defineRoutes(i18n);
    router.update_in_progress = true;
    router.state_manager = state_manager;
  }

  get current_route() {
    return this.state_manager.state.route;
  }

  get main_routes(){
    return this.routes.filter((route)=>{ return route.route_name !== 'MissingRoute'; })
  }

  locale(){
    let router = this;
    return router.current_route.params.locale;
  }

  setLocation(location) {
    let router = this,
        new_route = router.findRoute(location);

    new_route.setParams(location);
    return router.state_manager.setRoute(new_route);
  }

  findRoute(location) {
    let router = this;
    return router.routes.find((route) => {
      return route.matchesLocation(location);
    });
  }

  /*
   * Client-only
   */

  // should be used on app initialization.
  setLocationToCurrentUrl() {
    let router = this,
        current_location = {
          pathname: window.location.pathname,
          query: queryString.parse(window.location.search)
        };
    return router.setLocation(current_location);
  }

  initializeHistory(component) {
    let router = this;
    router.history = component.props.createHistory();
    router.history.listen((new_location) => {
      if (new_location.action !== 'PUSH') return false;
      router.setLocation(new_location)
        .then(() => {
          return component.syncFromStateManager();
        })
        .then(() => {
          router.update_in_progress = false;
          if (router.afterLocationUpdate) return router.afterLocationUpdate(new_location);
          return undefined
        });
    })
  }

  static locale(){
    let pathname = window.location.pathname,
        match = pathname.match(new RegExp('^\/?(\\w{2})(\/|$)'));

    if (!match){ return undefined; }
    return match[1];
  }

}
