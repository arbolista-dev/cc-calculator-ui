/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import FlashMessage from './flash_message.component';

describe('FlashMessage component', ()=>{
  it('renders without problems', (done)=>{
      flash_message = TestUtils.renderIntoDocument(React.createElement(FlashMessage) );
      expect(flash_message.state).toEqual({});
      done();
  });
});
