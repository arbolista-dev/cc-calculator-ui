/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Footprint from './footprint.component';

describe('Footprint component', ()=>{
  it('renders without problems', (done)=>{
      footprint = TestUtils.renderIntoDocument(React.createElement(Footprint) );
      expect(footprint.state).toEqual({});
      done();
  });
});
