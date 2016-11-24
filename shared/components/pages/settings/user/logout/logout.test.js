/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../../../application/application.component.mock';

import Logout from './logout.component';

describe('Logout component', () => {
  it('renders without problems', (done) => {
    const logout = TestUtils.renderIntoDocument(wrapWithContext(Logout));
    expect(TestUtils.findRenderedComponentWithType(logout, Logout).state).not.toBe(null);
    done();
  });
});
