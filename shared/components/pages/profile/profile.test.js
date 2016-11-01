/*global describe it expect profile*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Profile from './profile.component';

describe('Profile component', ()=>{
  it('renders without problems', (done)=>{
    profile = TestUtils.renderIntoDocument(React.createElement(Profile) );
    expect(profile.state).toEqual({});
    done();
  });
});
