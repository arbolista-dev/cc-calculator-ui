/*global describe it expect home*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Home from './home.component';

describe('Home component', ()=>{
  it('renders without problems', (done)=>{
    home = TestUtils.renderIntoDocument(React.createElement(Home) );
    expect(home.state).toEqual({});
    done();
  });
});
