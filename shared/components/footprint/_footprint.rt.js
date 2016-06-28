import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-md',
        'id': 'footprint'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '-black.svg' }), React.createElement('h4', {}, this.t('footprint.title')))), React.createElement('div', { 'id': 'overall_comparative_pie' }), React.createElement('div', { 'className': 'chart-legend' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/your-footprint-icon.png' }), '\n      ', this.t('footprint.your_footprint'), '\n    '), React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/average-footprint-icon.png' }), '\n      ', this.t('footprint.average_footprint'), '\n    ')), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.previous.bind(this.router) }, this.t('Previous')), React.createElement('a', { 'onClick': this.router.next.bind(this.router) }, this.t('Next'))));
}