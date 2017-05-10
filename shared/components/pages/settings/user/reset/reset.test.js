/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../../../application/application.component.mock';

import Reset from './reset.component';

describe('Reset component', () => {
  it('renders without problems', (done) => {
    const reset = TestUtils.renderIntoDocument(wrapWithContext(Reset));
    expect(TestUtils.findRenderedComponentWithType(reset, Reset).state).not.toBe(null);
    done();
  });
});
