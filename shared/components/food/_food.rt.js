import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'food'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.title)), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t('food.calories_per_day.label')), React.createElement('input', {
        'onChange': this.updateFootprintInput.bind(this),
        'data-cc_api_key': 'calories_per_day'
    })), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t('food.meat_per_day.label')), React.createElement('input', {
        'onChange': this.updateFootprintInput.bind(this),
        'data-cc_api_key': 'meat_per_day'
    }))), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('button', {
        'onClick': this.router.previous.bind(this.router),
        'className': 'btn'
    }, this.t('Previous')), React.createElement('button', {
        'onClick': this.router.next.bind(this.router),
        'className': 'btn'
    }, this.t('Next'))));
}