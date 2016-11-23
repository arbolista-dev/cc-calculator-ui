/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../../../application/application.component.mock';

import ForgotPassword from './forgot_password.component';

describe('ForgotPassword component', () => {
  it('renders without problems', (done) => {
    const forgot_password = TestUtils.renderIntoDocument(wrapWithContext(ForgotPassword));
    expect(TestUtils.findRenderedComponentWithType(
        forgot_password, ForgotPassword).state).not.toBe(null);
    done();
  });
});
