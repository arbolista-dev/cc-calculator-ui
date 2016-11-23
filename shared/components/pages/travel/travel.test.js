/* global describe it expect*/

import TestUtils from 'react-addons-test-utils';
import wrapWithContext from '../../application/application.component.mock';


import Travel from './travel.component';

describe('Travel component', () => {
  it('renders without problems', (done) => {
    const travel = TestUtils.renderIntoDocument(
        wrapWithContext(Travel),
    );
    expect(TestUtils.findRenderedComponentWithType(travel, Travel).state).not.toBe(null);
    done();
  });
});
