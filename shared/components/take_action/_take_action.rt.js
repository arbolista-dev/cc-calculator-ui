import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'take_action'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.title)), React.createElement('div', { 'className': 'cc-component__form' }), React.createElement('div', { 'className': 'cc-component__nav' }, this.route_key !== 'get_started' ? React.createElement('button', { 'className': 'btn' }, this.t('Previous')) : null, this.route_key !== 'take_action' ? React.createElement('button', { 'className': 'btn' }, this.t('Next')) : null));
}