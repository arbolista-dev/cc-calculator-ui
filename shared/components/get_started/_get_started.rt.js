import React from 'react';
import _ from 'lodash';
function repeatMode1(mode, modeIndex) {
    return React.createElement('a', {
        'className': _({ active: this.locationModeActive(mode[0]) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ') + ' ' + 'btn btn-primary',
        'key': 'location_mode_' + mode[0],
        'type': 'button',
        'onClick': this.setLocationMode.bind(this, mode[0])
    }, this.t(mode[1]));
}
function repeatSuggestion2(suggestion, suggestionIndex) {
    return React.createElement('div', {
        'className': 'get-started__location-suggestion',
        'onClick': this.setLocation.bind(this, suggestion)
    }, suggestion);
}
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-sm',
        'id': 'get_started'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('h2', {}, this.title)), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement.apply(this, [
        'div',
        {
            'className': 'btn-group btn-group-justified',
            'role': 'group'
        },
        _.map(this.location_modes, repeatMode1.bind(this))
    ])), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('input', {
        'className': 'form-control',
        'placeholder': this.t('get_started.location_prompt'),
        'onChange': this.setLocationSuggestions.bind(this),
        'onBlur': this.hideLocationSuggestions.bind(this),
        'onFocus': this.showLocationSuggestions.bind(this)
    }), React.createElement.apply(this, [
        'div',
        { 'id': 'get_started_location_suggestions' },
        _.map(this.state.location_suggests, repeatSuggestion2.bind(this))
    ])), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t('get_started.size.label')), React.createElement('div', { 'id': 'size_slider' })), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t('get_started.income.label')), React.createElement('div', { 'id': 'income_slider' }))), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.next.bind(this.router) }, this.t('Next'))));
}