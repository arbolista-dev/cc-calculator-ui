import React from 'react';
import _ from 'lodash';
function repeatKey1(key, keyIndex) {
    return React.createElement('tr', { 'key': 'cc_key_' + key }, React.createElement('td', {}, key), React.createElement('td', {}, this.state_manager.state.user_footprint[key]), React.createElement('td', {}, this.state_manager.state.average_footprint[key]));
}
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'graphs'
    }, '\n  Graphs to be implemented. In the meantime...\n  ', React.createElement('table', { 'className': 'table' }, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'You'), React.createElement('th', {}, 'Regional Average'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.state_manager.cool_climate_keys.sort(), repeatKey1.bind(this))
    ])));
}