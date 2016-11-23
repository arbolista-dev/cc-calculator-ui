/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';

import TakeAction from './take_action.component';

describe('TakeAction component', () => {
  it('renders without problems', (done) => {
    const take_action = TestUtils.renderIntoDocument(wrapWithContext(TakeAction, {
      external_offset: {
        cta: {
          show_equation: true,
          title: 'Mock',
          carbon_price_per_ton: 1,
          description: '',
          button_title: '',
          offset_url: '',
        },
      },
    }));
    expect(TestUtils.findRenderedComponentWithType(take_action, TakeAction).state).not.toBe(null);
    done();
  });
});
