/* global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Leaders from './leaders.component';

describe('Leaders component', () => {
  it('renders without problems', (done) => {
    const leaders = TestUtils.renderIntoDocument(wrapWithContext(Leaders));
    expect(TestUtils.findRenderedComponentWithType(leaders, Leaders).state).not.toBe(null);
    done();
  });
});
