/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Graphs from './graphs.component';

describe('Graphs component', () => {
  it('renders without problems', (done) => {
    const graphs = TestUtils.renderIntoDocument(React.createElement(Graphs));
    expect(graphs.state).toEqual({});
    done();
  });
});
