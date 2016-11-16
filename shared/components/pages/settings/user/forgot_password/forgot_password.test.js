/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import ForgotPassword from './forgot_password.component';

describe('ForgotPassword component', () => {
  it('renders without problems', (done) => {
    const forgot_password = TestUtils.renderIntoDocument(React.createElement(ForgotPassword));
    expect(forgot_password.state).toEqual({});
    done();
  });
});
