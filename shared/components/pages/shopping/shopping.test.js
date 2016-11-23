/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Shopping from './shopping.component';

describe('Shopping component', () => {
  it('renders without problems', (done) => {
    const shopping = TestUtils.renderIntoDocument(wrapWithContext(Shopping));
    expect(TestUtils.findRenderedComponentWithType(shopping, Shopping).state).not.toBe(null);
    done();
  });
});
