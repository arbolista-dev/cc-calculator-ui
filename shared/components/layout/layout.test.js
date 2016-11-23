/* eslint-env node, jasmine */

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Layout from './layout.component';
import wrapWithContext from '../application/application.component.mock';

describe('layout component', () => {
  it('renders and prompts example selection', () => {
    let layout = TestUtils.renderIntoDocument(wrapWithContext(Layout));
    layout = TestUtils.findRenderedComponentWithType(layout, Layout);
    expect(layout.state.example).not.toBe(null);
  });
});

