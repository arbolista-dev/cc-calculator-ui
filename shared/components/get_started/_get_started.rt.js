import React from 'react';
import _ from 'lodash';
function repeatMode1(mode, modeIndex) {
    return React.createElement('button', {
        'className': _({ active: this.locationModeActive(mode[0]) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ') + ' ' + 'btn btn-default',
        'key': 'location_mode_' + mode[0],
        'type': 'button',
        'onClick': this.setLocationMode.bind(this, mode[0])
    }, this.t(mode[1]));
}
function repeatSuggestion2(suggestion, suggestionIndex) {
    return React.createElement('div', {
        'className': 'get-started__location-suggestion',
        'onClick': this.updateDefaults.bind(this, { input_location: suggestion })
    }, suggestion);
}
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'get_started'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.title)), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement.apply(this, [
        'div',
        {
            'className': 'btn-group',
            'role': 'group'
        },
        _.map(this.location_modes, repeatMode1.bind(this))
    ]), React.createElement('div', {}, React.createElement('input', {
        'placeholder': this.t('get_started.location_prompt'),
        'onChange': this.setLocationSuggestions.bind(this),
        'onBlur': this.hideLocationSuggestions.bind(this),
        'onFocus': this.showLocationSuggestions.bind(this)
    }), React.createElement.apply(this, [
        'div',
        { 'id': 'get_started_location_suggestions' },
        _.map(this.state.location_suggests, repeatSuggestion2.bind(this))
    ]))), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('button', {
        'onClick': this.router.next.bind(this.router),
        'className': 'btn'
    }, this.t('Next'))));
}