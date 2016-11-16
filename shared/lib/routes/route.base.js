import queryString from 'query-string';

export default class RouteBase {

  constructor(route_definition) {
    const route = this;
    route.params = {};
    Object.assign(route, route_definition);
  }

  matchesLocation(pathname) {
    const route = this;
    return route.path.test(pathname);
  }

  // location is a React History location object.
  parseParams(location) {
    const route = this;
    const match = location.pathname.match(route.path);
    const params = {};
    if (match) {
      Object.keys(route.parameters).forEach((i) => {
        const param = route.parameters[i];
        const value = match[parseInt(i, 10)];
        params[param] = value;
      });
      if (location.query) {
        let query = location.query;
        if (typeof query === 'string') {
          query = queryString.parse(query);
        }
        Object.assign(params, query);
      }
    }
    return params;
  }

  // route should override if it must use state to generate url
  url(_action, i18n) {
    const route = this;
    const route_path = i18n.t(`${route.key}.route_path`);
    return `/${i18n.language}/${route_path}`;
  }

}
