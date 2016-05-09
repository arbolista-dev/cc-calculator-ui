/*global describe it expect console JS_ENV beforeEach*/

import TestUtils from 'react-addons-test-utils';
import createHistory from 'history/lib/createHashHistory';
import React from 'react';
import _ from 'lodash';

import Layout from './layout.component';
import StateManager from './../../lib/state_manager/state_manager';
import Router from './../../lib/router/router';
import {
  ROUTES
} from './../../lib/routes';


if (JS_ENV === 'client') {

  describe('layout component', () => {

    let state_manager, router;
    beforeEach((done) => {
      state_manager = new StateManager();
      router = new Router(state_manager, ROUTES);
      state_manager.getInitialData()
        .then(() => {
          return router.setLocation({
            pathname: '/'
          });
        })
        .then(done);
    });

    it('renders and prompts example selection', () => {

      const initial_props = Object.assign({
            environment: JS_ENV,
            state_manager: state_manager,
            createHistory: createHistory,
            router: router
          }, state_manager.state),
          layout = TestUtils.renderIntoDocument(React.createElement(Layout, initial_props)),
          alert = TestUtils.findRenderedDOMComponentWithClass(layout, 'alert-warning');
      expect(_.trim(alert.textContent)).toEqual('Choose an example.');
      expect(layout.state.example).toEqual(undefined);
    });

    it('allows user to set example url', (done) => {

      let initial_props = initial_props = Object.assign({
            environment: JS_ENV,
            state_manager: state_manager,
            createHistory: createHistory,
            router: router
          }, state_manager.state),
          layout = TestUtils.renderIntoDocument(React.createElement(Layout, initial_props));
      try {
        var buttons = TestUtils.scryRenderedDOMComponentsWithClass(layout, 'btn-primary');
        expect(buttons.length).toEqual(3);

        router.afterLocationUpdate = (_new_location) => {
          var info = TestUtils.findRenderedDOMComponentWithClass(layout, 'alert-info');
          expect(_.trim(info.textContent)).toEqual('Hi, I\'m Bob!');

          var selected = TestUtils.scryRenderedDOMComponentsWithClass(layout, 'active');
          expect(selected.length).toEqual(1);
          expect(selected[0].dataset.value).toEqual('1');

          expect(layout.state.example).toEqual(layout.examples[0]);

          done();
        };
        // click a button to select an example
        TestUtils.Simulate.click(buttons[0]);
      } catch (err) {
        console.error(err)
        expect(false).toEqual(true);
        done();
      }
    });

  });

}
