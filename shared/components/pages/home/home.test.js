/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Home from './home.component';

describe('Home component', () => {
  it('renders without problems', (done) => {
    const home = TestUtils.renderIntoDocument(wrapWithContext(Home));
    expect(TestUtils.findRenderedComponentWithType(home, Home).state).not.toBe(null);
    done();
  });
});
