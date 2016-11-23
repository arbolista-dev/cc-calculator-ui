/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Food from './food.component';

describe('Food component', () => {
  it('renders without problems', (done) => {
    const food = TestUtils.renderIntoDocument(wrapWithContext(Food));
    expect(TestUtils.findRenderedComponentWithType(food, Food).state).not.toBe(null);
    done();
  });
});
