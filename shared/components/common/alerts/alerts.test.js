/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import Alerts from './alerts.component';

describe('FlashMessage component', () => {
  it('renders without problems', (done) => {
    const alerts = TestUtils.renderIntoDocument(wrapWithContext(Alerts, {}, {
      list: [],
    }));
    expect(TestUtils.findRenderedComponentWithType(alerts, Alerts).state).not.toBe(null);
    done();
  });
});
