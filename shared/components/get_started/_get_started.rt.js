import React from 'react';
import _ from 'lodash';
function repeatMode1(mode, modeIndex) {
    return React.createElement('a', {
        'className': _({
            'btn-success': this.locationModeActive(mode[0]),
            'btn-default': !this.locationModeActive(mode[0])
        }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ') + ' ' + 'btn',
        'key': 'location_mode_' + mode[0],
        'type': 'button',
        'onClick': this.setLocationMode.bind(this, mode[0])
    }, this.t(mode[1]));
}
function mergeProps(inline, external) {
    var res = _.assign({}, inline, external);
    if (inline.hasOwnProperty('style')) {
        res.style = _.defaults(res.style, inline.style);
    }
    if (inline.hasOwnProperty('className') && external.hasOwnProperty('className')) {
        res.className = external.className + ' ' + inline.className;
    }
    return res;
}
function repeatSuggestion3(suggestion, suggestionIndex) {
    return React.createElement('div', {
        'key': this.state.locations.data[suggestionIndex],
        'data-zipcode': this.state.locations.data[suggestionIndex],
        'data-suggestion': suggestion,
        'className': 'get-started__location-suggestion',
        'onClick': this.setLocation.bind(this)
    }, suggestion);
}
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-md',
        'id': 'get_started'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '-black.svg' }), React.createElement('h4', {}, this.t('get_started.title'))), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('get_started.byline'))), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', {
        'id': 'location_mode_btn_group_container',
        'className': 'cc-component__question'
    }, React.createElement.apply(this, [
        'div',
        {
            'id': 'location_mode_btn_group',
            'className': 'btn-group',
            'role': 'group'
        },
        _.map(this.location_modes, repeatMode1.bind(this))
    ])), React.createElement('div', {
        'id': 'get_started_location_suggestions_container',
        'className': 'cc-component__question'
    }, React.createElement('input', mergeProps({
        'className': 'form-control',
        'placeholder': this.t('get_started.location_prompt'),
        'value': this.input_location_display,
        'onChange': this.setLocationSuggestions.bind(this)
    }, { disabled: this.country_mode })), this.show_location_suggestions ? React.createElement.apply(this, [
        'div',
        { 'id': 'get_started_location_suggestions' },
        React.createElement('div', {
            'className': 'get-started__location-suggestion',
            'onClick': this.hideLocationSuggestions.bind(this)
        }, this.t('Hide')),
        _.map(this.state.locations.suggestions, repeatSuggestion3.bind(this))
    ]) : null), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h4', {}, this.t('get_started.size.label')), React.createElement('div', {
        'className': 'cc-slider-container',
        'id': 'size_slider'
    })), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h4', {}, this.t('get_started.income.label')), React.createElement('div', {
        'className': 'cc-slider-container',
        'id': 'income_slider'
    }))), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.next.bind(this.router) }, this.t('Next'))));
}