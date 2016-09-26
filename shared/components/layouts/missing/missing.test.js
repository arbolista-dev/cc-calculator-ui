/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Missing from './missing.component';

describe('Missing component', ()=>{
  it('renders without problems', (done)=>{
    missing = TestUtils.renderIntoDocument(React.createElement(Missing) );
    expect(missing.state).toEqual({});
    done();
  });
});
