import React from 'react';
import _ from 'lodash';
import GetStarted from './../get_started/get_started.component';
import Travel from './../travel/travel.component';
import Home from './../home/home.component';
import Food from './../food/food.component';
import Shopping from './../shopping/shopping.component';
import Footprint from './../footprint/footprint.component';
import TakeAction from './../take_action/take_action.component';
import Missing from './../missing/missing.component';
import Graphs from './../graphs/graphs.component';
function repeatRoute1(route, routeIndex) {
    return React.createElement('div', {
        'className': 'cc-nav__item' + ' ' + _({ 'cc-nav__item--active': this.current_route_name === route.route_name }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'key': route.key
    }, React.createElement('img', { 'src': '/assets/img/' + route.key + '.png' }), React.createElement('span', {}, this.t(`${ route.key }.title`)));
}
export default function () {
    return React.createElement('div', { 'id': 'cc_calculator_ui' }, React.createElement.apply(this, [
        'div',
        { 'id': 'cc_nav' },
        _.map(this.router.main_routes, repeatRoute1.bind(this))
    ]), React.createElement('div', { 'id': 'banner' }), React.createElement('div', {}, this.current_route_name === 'GetStarted' ? React.createElement(GetStarted, { 'state_manager': this.state_manager }) : null, this.current_route_name === 'Travel' ? React.createElement(Travel, { 'state_manager': this.state_manager }) : null, this.current_route_name === 'Home' ? React.createElement(Home, { 'state_manager': this.state_manager }) : null, this.current_route_name === 'Food' ? React.createElement(Food, { 'state_manager': this.state_manager }) : null, this.current_route_name === 'Shopping' ? React.createElement(Shopping, { 'state_manager': this.state_manager }) : null, this.current_route_name === 'Footprint' ? React.createElement(Footprint, { 'state_manager': this.state_manager }) : null, this.current_route_name === 'TakeAction' ? React.createElement(TakeAction, { 'state_manager': this.state_manager }) : null, this.current_route_name === 'Missing' ? React.createElement(Missing, { 'state_manager': this.state_manager }) : null), React.createElement(Graphs, { 'state_manager': this.state_manager }));
}