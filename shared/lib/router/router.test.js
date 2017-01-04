/* global describe it expect*/

import Router from './router';
import RouteBase from './../routes/route.base';
import MissingRoute from './../routes/missing/missing';
import { includeHelpers } from './../routes';
/*
 * Test Shared Behavior of Subclasses
 */

const MOCK = {
  t(key, opts) {
    if (!opts) return key;
    return key.replace(/{{([^{}]*)}}/g,
        (a, b) => {
          const r = opts[b];
          return typeof r === 'string' || typeof r === 'number' ? r : a;
        },
    );
  },
  language: 'en',
};
class MockRuute extends RouteBase {

  get key() {
    return 'example';
  }

  get route_name() {
    return 'ExampleRoute';
  }
}
const ROUTES = [
  new MockRuute({
    path: new RegExp('^/examples/(\\d*)$'),
    parameters: { 1: 'example_id' },
  }),
  new MissingRoute({
    path: /\.*/,
    parameters: { },
  }),
];


const router = new Router(MOCK, includeHelpers(ROUTES));

describe('Router', () => {
  it('can set location for example specific location', (done) => {
    const location = router.parseLocation({
      pathname: '/examples/1',
      query: {},
    });
    expect(location.route_name).toEqual('ExampleRoute');
    expect(location.params).toEqual({ example_id: '1' });
    done();
  });

  it('can set location for missing route', (done) => {
    const location = router.parseLocation({
      pathname: '/doesnt_exist',
      query: {},
    });
    expect(location.route_name).toEqual('MissingRoute');
    expect(location.params).toEqual({});
    done();
  });
});
