/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';
import GetStarted from './get_started.component';

describe('GetStarted component', () => {
  it('renders without problems', (done) => {
    const get_started = TestUtils.renderIntoDocument(
      wrapWithContext(GetStarted),
    );
    expect(TestUtils.findRenderedComponentWithType(get_started, GetStarted).state).not.toBe(null);
    done();
  });
});
