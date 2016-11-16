/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Login from './login.component';

describe('Login component', () => {
  it('renders without problems', (done) => {
    const login = TestUtils.renderIntoDocument(React.createElement(Login));
    expect(login.state).toEqual({});
    done();
  });
});
