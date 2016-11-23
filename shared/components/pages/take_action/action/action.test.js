/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../../application/application.component.mock';

import Action from './action.component';

describe('Action component', () => {
  it('renders without problems', (done) => {
    const action = TestUtils.renderIntoDocument(wrapWithContext(Action));
    expect(TestUtils.findRenderedComponentWithType(action, Action).state).not.toBe(null);
    done();
  });
});
