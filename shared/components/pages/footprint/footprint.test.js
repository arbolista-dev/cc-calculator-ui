/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Footprint from './footprint.component';

describe('Footprint component', () => {
  it('renders without problems', (done) => {
    const footprint = TestUtils.renderIntoDocument(React.createElement(Footprint));
    expect(footprint.state).toEqual({});
    done();
  });
});
