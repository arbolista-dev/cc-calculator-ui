import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-sm',
        'id': 'footprint'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.title)), React.createElement('div', { 'className': 'cc-component__form' }), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.previous.bind(this.router) }, this.t('Previous')), React.createElement('a', { 'onClick': this.router.next.bind(this.router) }, this.t('Next'))));
}