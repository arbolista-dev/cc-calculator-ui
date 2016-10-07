/*global describe it expect login*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Login from './login.component';

describe('Login component', ()=>{
  it('renders without problems', (done)=>{
    login = TestUtils.renderIntoDocument(React.createElement(Login) );
    expect(login.state).toEqual({});
    done();
  });
});
