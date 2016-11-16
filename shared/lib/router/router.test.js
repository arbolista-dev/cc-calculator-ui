/* global describe it expect*/

import StateManager from './../state_manager/state_manager';
import Router from './router';
import { ROUTES } from './../routes';

/*
 * Test Shared Behavior of Subclasses
 */

const state_manager = new StateManager();
const router = new Router(state_manager, ROUTES);

describe('Router', () => {
  it('can set location for example specific location', (done) => {
    router.setLocation({
      pathname: '/examples/1',
      query: {},
    }).then(() => {
      expect(router.current_route.route_name).toEqual('ExampleRoute');
      expect(router.current_route.params).toEqual({ example_id: '1' });
      done();
    });
  });

  it('can set location for missing route', (done) => {
    router.setLocation({
      pathname: '/doesnt_exist',
      query: {},
    }).then(() => {
      expect(router.current_route.route_name).toEqual('MissingRoute');
      expect(router.current_route.params).toEqual({});
      done();
    });
  });
});
