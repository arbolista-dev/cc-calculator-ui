/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../../../application/application.component.mock';

import SignUp from './sign_up.component';

describe('SignUp component', () => {
  it('renders without problems', (done) => {
    const sign_up = TestUtils.renderIntoDocument(wrapWithContext(SignUp));
    expect(TestUtils.findRenderedComponentWithType(sign_up, SignUp).state).not.toBe(null);
    done();
  });
});
