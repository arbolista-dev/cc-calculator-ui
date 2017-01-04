/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import { fromJS } from 'immutable';
import wrapWithContext from '../../../application/application.component.mock';

import ExternalOffset from './external_offset.component';

describe('ExternalOffset component', () => {
  it('renders without problems', (done) => {
    const external_offset = TestUtils.renderIntoDocument(wrapWithContext(ExternalOffset, {}, {
      ui: fromJS({
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
      }),
      totalUserFootprint: '48.473001',
    }));
    expect(TestUtils.findRenderedComponentWithType(external_offset,
      ExternalOffset).state).not.toBe(null);
    done();
  });
});
