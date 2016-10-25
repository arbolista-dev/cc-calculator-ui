/*global describe it expect get_started*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import GetStarted from './get_started.component';

describe('GetStarted component', ()=>{
  it('renders without problems', (done)=>{
    get_started = TestUtils.renderIntoDocument(React.createElement(GetStarted) );
    expect(get_started.state).toEqual({});
    done();
  });
});
