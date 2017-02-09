/* global window*/
/* eslint no-useless-escape: "warn"*/

import queryString from 'query-string';
import extend from 'extend';

import updateLocation from 'shared/reducers/location/location.actions';
import defineRoutes from '../routes';

const NON_MAIN_ROUTES = ['Profile', 'Settings', 'MissingRoute', 'ForgotPassword'];

const DEFAULT_UPDATE_LOCATION_ACTION = {
  type: updateLocation.getType(),
  payload: {},
};

export default class Router {

  constructor(i18n, routes) {
    const router = this;

    router.i18n = i18n;
    router.routes = routes || Router.routes(i18n);

    router.update_in_progress = true;
  }

  get default_update_location_action() {
    return extend(true, {}, DEFAULT_UPDATE_LOCATION_ACTION);
  }

  get current_route() {
    return this.findRoute(Router.currentWindowLocation().pathname);
  }

  get main_routes() {
    return this.routes.filter(route => NON_MAIN_ROUTES.indexOf(route.route_name) < 0);
  }

  get locale() {
    return Router.locale();
  }

  shouldUpdateCurrentRoute(location) {
    const router = this;
    return !router.current_route || !router.current_route.matchesLocation(location.pathname);
  }

  initializeHistory(createHistory, store) {
    const router = this;
    router.history = createHistory();
    router.history.listen(router.onLocationChange.bind(router, store));
  }

  findRoute(pathname) {
    const router = this;
    return router.routes.find(route => route.matchesLocation(pathname));
  }

  parseLocation(new_location) {
    const route = this.findRoute(new_location.pathname);
    const location = {
      pathname: new_location.pathname,
      query: queryString.parse(new_location.search),
    };
    location.route_name = route.route_name;
    location.params = route.parseParams(location);
    return location;
  }

  // Changing Route

  // this will cause onLocationChange to fire with
  // the new location.

  goToRouteByName(route_name) {
    const router = this;
    window.jQuery("[data-toggle='popover']").popover('hide');
    if (window.parent) {
      window.parent.postMessage({ scrollTop: true }, '*');
      router.pushRoute(route_name);
    } else {
      window.jQuery('html, body').animate({ scrollTop: 0 }, 500, () => router.pushRoute(route_name));
    }
  }

  pushRoute(route_name, action_params, payload) {
    const router = this;
    const route = router.routes.getRoute(route_name);
    let action = action_params;

    action = {
      type: action ? action.getType() : updateLocation.getType(),
      payload,
      no_scroll: payload ? payload.no_scroll : false,
    };

    router.pushHistory({
      pathname: route.url(action, router.i18n),
      state: action,
    });
  }

  goToActionByKey(action_key) {
    const router = this;
    const action = {
      type: updateLocation.getType(),
      payload: {},
      no_scroll: false,
    };

    router.pushHistory({
      pathname: `/${router.i18n.language}/${router.i18n.t('take_action.route_path')}/${action_key}`,
      state: action,
    });
  }

  pushHistory(location) {
    this.history.push(location);
  }

  next() {
    const router = this;
    const current_i = router.routes.indexOf(router.current_route);
    const next_route = router.routes[current_i + 1];
    return router.pushRoute(next_route.route_name);
  }

  previous() {
    const router = this;
    const current_i = router.routes.indexOf(router.current_route);
    const next_route = router.routes[current_i - 1];
    return router.pushRoute(next_route.route_name);
  }

  onLocationChange(store, new_location) {
    const router = this;

    if (new_location.action !== 'PUSH') return;
    if (router.scrollForNewLocation(new_location)) router.scrollToTop();

    const action = extend(true, { payload: {} }, new_location.state) ||
    this.default_update_location_action;

    action.payload.location = this.parseLocation(new_location);
    store.dispatch(action);
  }

  scrollForNewLocation(location) {
    return !location.state || !location.state.no_scroll;
  }

  scrollToTop() {
    window.jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
  }

  static currentWindowLocation() {
    const pathname = window.location.pathname;
    const search = window.location.search;
    return { pathname, search };
  }

  // Use this when createHistory is a hash history
  static currentHashLocation() {
    const hash = window.location.hash;
    const match = hash.match(/^#([^\?]+)(\?.+)?/);
    return {
      pathname: match ? match[1] : '',
      query: match && match[2] ? match[2] : '',
    };
  }

  static locale() {
    const pathname = window.location.pathname;
    const match = pathname.match(new RegExp('^/?(\\w{2})(/|$)'));

    if (!match) { return 'en'; }
    return match[1];
  }

  static routes(i18n) {
    return defineRoutes(i18n);
  }

}
