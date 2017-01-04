/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../../../application/application.component.mock';

import Login from './login.component';

describe('Login component', () => {
  it('renders without problems', (done) => {
    const login = TestUtils.renderIntoDocument(wrapWithContext(Login));
    expect(TestUtils.findRenderedComponentWithType(login, Login).state).not.toBe(null);
    done();
  });
});
