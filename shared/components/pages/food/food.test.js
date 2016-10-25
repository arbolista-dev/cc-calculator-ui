/*global describe it expect food*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Food from './food.component';

describe('Food component', ()=>{
  it('renders without problems', (done)=>{
    food = TestUtils.renderIntoDocument(React.createElement(Food) );
    expect(food.state).toEqual({});
    done();
  });
});
