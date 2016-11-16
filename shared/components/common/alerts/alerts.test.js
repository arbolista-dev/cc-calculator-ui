/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Alerts from './alerts.component';

describe('FlashMessage component', () => {
  it('renders without problems', (done) => {
    const alerts = TestUtils.renderIntoDocument(React.createElement(Alerts));
    expect(alerts.state).toEqual({});
    done();
  });
});
