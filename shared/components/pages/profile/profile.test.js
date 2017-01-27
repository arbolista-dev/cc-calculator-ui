/* eslint-env node, jasmine, browser */

import TestUtils from 'react-addons-test-utils';
import 'bootstrap/dist/js/bootstrap.min';
import wrapWithContext from '../../application/application.component.mock';

import Profile from './profile.component';

describe('Profile component', () => {
  beforeEach(() => {
    const fixture = '<div id="test"><div id="root"></div><div id="prerender_data"></div><div id="graphs"></div>' +
            '<div id="overall_comparative_pie"></div>' +
              '<div id="overview_bar_chart"></div></div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
  });
  it('renders without problems', (done) => {
    const profile = TestUtils.renderIntoDocument(wrapWithContext(Profile));
    expect(TestUtils.findRenderedComponentWithType(profile, Profile).state).not.toBe(null);
    done();
  });
  afterEach(() => {
    const elem = document.getElementById('test');
    elem.parentNode.removeChild(elem);
  });
});
