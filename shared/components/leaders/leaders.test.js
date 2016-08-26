/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Leaders from './leaders.component';

describe('Leaders component', ()=>{
  it('renders without problems', (done)=>{
      leaders = TestUtils.renderIntoDocument(React.createElement(Leaders) );
      expect(leaders.state).toEqual({});
      done();
  });
});
