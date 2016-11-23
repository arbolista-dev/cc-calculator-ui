/* global describe it expect*/

import MissingRoute from './missing';

const route = new MissingRoute({
  path: /\.*/,
  parameters: { 2: 'locale' },
});

describe('shared Route behavior', () => {
  it('has a name', () => {
    expect(typeof route.route_name).toEqual('string');
  });
});

describe('MissingRoute', () => {
  it('detects location', () => {
    expect(route.matchesLocation({ pathname: '/' })).toBe(true);
    expect(route.matchesLocation({ pathname: '' })).toBe(true);
    expect(route.matchesLocation({ pathname: '/234sdfsd' })).toBe(true);
    expect(route.matchesLocation({ pathname: '/examples/234' })).toBe(true);
  });
  /*
  it('properly sets params', () => {
    route.setParams({ pathname: '/whatever' });
    expect(route.params).toEqual({});
  });*/
});

