/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Settings from './settings.component';

describe('Settings component', ()=>{
  it('renders without problems', (done)=>{
    settings = TestUtils.renderIntoDocument(React.createElement(Settings) );
    expect(settings.state).toEqual({});
    done();
  });
});
