/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Shopping from './shopping.component';

describe('Shopping component', () => {
  it('renders without problems', (done) => {
    const shopping = TestUtils.renderIntoDocument(React.createElement(Shopping));
    expect(shopping.state).toEqual({});
    done();
  });
});
