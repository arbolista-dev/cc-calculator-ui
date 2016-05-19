import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'travel'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.title)), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label--left' }, this.t('travel.publictrans.label')), React.createElement('input', {
        'onChange': this.updateFootprintInput.bind(this),
        'data-api_key': 'input_footprint_transportation_publictrans',
        'className': 'cc-component__question-input--right'
    })), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label--left' }, this.t('travel.airtotal.label')), React.createElement('input', {
        'onChange': this.updateFootprintInput.bind(this),
        'data-api_key': 'input_footprint_transportation_airtotal',
        'className': 'cc-component__question-input--right'
    }))), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('button', {
        'onClick': this.router.previous.bind(this.router),
        'className': 'btn'
    }, this.t('Previous')), React.createElement('button', {
        'onClick': this.router.next.bind(this.router),
        'className': 'btn'
    }, this.t('Next'))));
}