/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import ExternalOffset from './external_offset.component';

describe('ExternalOffset component', () => {
  it('renders without problems', (done) => {
    const external_offset = TestUtils.renderIntoDocument(React.createElement(ExternalOffset));
    expect(external_offset.state).toEqual({});
    done();
  });
});
