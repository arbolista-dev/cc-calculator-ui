/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Action from './action.component';

describe('Action component', () => {
  it('renders without problems', (done) => {
    const action = TestUtils.renderIntoDocument(React.createElement(Action));
    expect(action.state).toEqual({});
    done();
  });
});
