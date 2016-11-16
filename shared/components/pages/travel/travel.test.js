/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Travel from './travel.component';

describe('Travel component', () => {
  it('renders without problems', (done) => {
    const travel = TestUtils.renderIntoDocument(React.createElement(Travel));
    expect(travel.state).toEqual({});
    done();
  });
});
