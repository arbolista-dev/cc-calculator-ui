/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Missing from './missing.component';

describe('Missing component', () => {
  it('renders without problems', (done) => {
    const missing = TestUtils.renderIntoDocument(wrapWithContext(Missing));
    expect(TestUtils.findRenderedComponentWithType(missing, Missing).state).not.toBe(null);
    done();
  });
});
