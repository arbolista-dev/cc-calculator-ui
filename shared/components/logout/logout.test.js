/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Logout from './logout.component';

describe('Logout component', ()=>{
  it('renders without problems', (done)=>{
      logout = TestUtils.renderIntoDocument(React.createElement(Logout) );
      expect(logout.state).toEqual({});
      done();
  });
});
