/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Shopping from './shopping.component';

describe('Shopping component', ()=>{
  it('renders without problems', (done)=>{
      shopping = TestUtils.renderIntoDocument(React.createElement(Shopping) );
      expect(shopping.state).toEqual({});
      done();
  });
});
