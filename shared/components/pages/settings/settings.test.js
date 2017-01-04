/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Settings from './settings.component';

describe('Settings component', () => {
  it('renders without problems', (done) => {
    const settings = TestUtils.renderIntoDocument(wrapWithContext(Settings));
    expect(TestUtils.findRenderedComponentWithType(settings, Settings).state).not.toBe(null);
    done();
  });
});
