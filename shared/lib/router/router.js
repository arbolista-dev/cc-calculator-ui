/*global window*/

import queryString from 'query-string';
import {defineRoutes} from '../routes';

const NON_MAIN_ROUTES = ['Settings', 'MissingRoute', 'ForgotPassword'];

export default class Router {

  constructor(state_manager, i18n) {
    let router = this;

    router.i18n = i18n;
    router.routes = defineRoutes(i18n);
    router.update_in_progress = true;
    router.state_manager = state_manager;
  }

  get current_route() {
    return this.state_manager.state.route;
  }

  get main_routes(){
    return this.routes.filter((route)=>{
      return  NON_MAIN_ROUTES.indexOf(route.route_name) < 0;
    })
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

  next(){
    let router = this,
        current_i = router.routes.indexOf(router.current_route),
        next_route = router.routes[current_i + 1];
    return router.goToRoute(next_route);
  }

  previous(){
    let router = this,
        current_i = router.routes.indexOf(router.current_route),
        next_route = router.routes[current_i - 1];
    return router.goToRoute(next_route);
  }

  goToRoute(route){
    let router = this,
        route_key = route.key,
        i18n = router.i18n,
        url = `/${i18n.language}/${i18n.t(route_key + '.route_path')}`

    window.jQuery("[data-toggle='popover']").popover('hide');
    window.jQuery("html, body").animate({ scrollTop: 0 }, 500, ()=>{
      return router.history.push(url);
    });
  }

  goToRouteByName(route_name){
    let route = this.routes.find((route)=>{
      return route.route_name === route_name;
    });
    this.goToRoute(route)
  }

  goToUri(uri){
    let router = this,
        go_to = this.routes.filter((route) => {
          return route.route_name === uri;
        });
    router.goToRoute(go_to[0])
  }

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
