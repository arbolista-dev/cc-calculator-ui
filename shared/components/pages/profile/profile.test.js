/* global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Profile from './profile.component';

describe('Profile component', () => {
  it('renders without problems', (done) => {
    const profile = TestUtils.renderIntoDocument(wrapWithContext(Profile));
    expect(TestUtils.findRenderedComponentWithType(profile, Profile).state).not.toBe(null);
    done();
  });
});
