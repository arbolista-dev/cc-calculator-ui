import React from 'react';
import _ from 'lodash';
function repeatAction1(action, actionIndex) {
    return React.createElement('tbody', { 'key': action.key }, React.createElement('tr', {}, React.createElement('td', { 'onClick': this.toggleAction.bind(this, action) }, React.createElement('i', {
        'className': 'fa' + ' ' + _({
            'fa-square': !action.taken,
            'fa-check-square': action.taken
        }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    })), React.createElement('td', { 'colSpan': '2' }, React.createElement('h4', {}, '\n            ', action.display_name, '\n            ', React.createElement('button', {
        'className': 'take-action__detail-toggle btn btn-default btn-xs',
        'onClick': this.toggleActionDetails.bind(this, action)
    }, React.createElement('i', {
        'className': _({
            'fa-expand': !action.detailed,
            'fa-compress': action.detailed
        }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ') + ' ' + 'fa'
    }))))), React.createElement('tr', {
        'className': _({ hidden: !action.detailed }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }, React.createElement('td', {}, action.tons_saved), React.createElement('td', {}, '$', action.dollars_saved), React.createElement('td', {}, '$', action.upfront_cost)));
}
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'take_action'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.title)), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement.apply(this, [
        'table',
        { 'className': 'table' },
        _.map(this.actions, repeatAction1.bind(this))
    ])), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('button', {
        'onClick': this.router.previous.bind(this.router),
        'className': 'btn'
    }, this.t('Previous'))));
}