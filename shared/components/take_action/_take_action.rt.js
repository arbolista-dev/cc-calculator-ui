import React from 'react';
import _ from 'lodash';
function repeatAction1(action, actionIndex) {
    return React.createElement('div', { 'key': action.key }, React.createElement('div', {
        'className': 'take-action__action-heading' + ' ' + _({ 'take-action__action-heading--taken': action.taken }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onClick': this.toggleActionDetails.bind(this, action)
    }, React.createElement('h5', {}, action.display_name)), React.createElement('div', {
        'className': 'take-action__action-body' + ' ' + _({ hidden: !action.detailed }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }, React.createElement('div', {}, React.createElement('div', { 'className': 'take-action__savings-amount' }, action.tons_saved), React.createElement('div', { 'className': 'take-action__savings-label' }, this.t('take_action.tons_saved'))), React.createElement('div', {}, React.createElement('div', { 'className': 'take-action__savings-amount' }, '$', action.dollars_saved), React.createElement('div', { 'className': 'take-action__savings-label' }, this.t('take_action.dollars_saved'))), React.createElement('div', {}, React.createElement('div', { 'className': 'take-action__savings-amount' }, '$', action.upfront_cost), React.createElement('div', { 'className': 'take-action__savings-label' }, this.t('take_action.upfront_cost'))), React.createElement('button', {
        'className': 'btn btn-default',
        'onClick': this.toggleAction.bind(this, action)
    }, React.createElement('i', {
        'className': 'fa' + ' ' + _({
            'fa-check-square-o': !action.taken,
            'fa-check-square': action.taken
        }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }))));
}
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-md',
        'id': 'take_action'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '-black.svg' }), React.createElement('h4', {}, this.title)), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('take_action.byline'))), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement.apply(this, [
        'div',
        {},
        _.map(this.actions, repeatAction1.bind(this))
    ])), React.createElement('div', { 'id': 'take_action_savings' }, React.createElement('span', { 'className': 'label label-info' }, this.displayTakeactionSavings('result_takeaction_pounds'), ' ', this.t('take_action.tons_saved')), React.createElement('br', {}), React.createElement('span', { 'className': 'label label-info' }, '$', this.displayTakeactionSavings('result_takeaction_dollars'), ' ', this.t('take_action.dollars_saved')), React.createElement('br', {}), React.createElement('span', { 'className': 'label label-info' }, '$', this.displayTakeactionSavings('result_takeaction_net10yr'), ' ', this.t('take_action.upfront_cost')), React.createElement('br', {})), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.previous.bind(this.router) }, this.t('Previous'))));
}