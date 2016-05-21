import React from 'react';
import _ from 'lodash';
function repeatFood_type1(food_type, food_typeIndex) {
    return React.createElement('div', { 'key': 'food_question_' + food_type }, React.createElement('div', {
        'className': 'cc-component__question' + ' ' + _({ hidden: !this.shouldShow(food_type) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t(`food.${ food_type }.label`)), React.createElement('div', { 'id': 'food_average_slider_' + food_type }), React.createElement('div', {}, this.displayUserCalories(food_type), ' ', React.createElement('i', {}, this.t('food.calories')))));
}
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'food'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.title), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('food.byline')), React.createElement('div', {}, React.createElement('span', {
        'className': 'cc-component__simple-toggle',
        'onClick': this.setSimple.bind(this)
    }, this.t('component.labels.simple')), ' |\n      ', React.createElement('span', {
        'className': 'cc-component__simple-toggle',
        'onClick': this.setAdvanced.bind(this)
    }, this.t('component.labels.advanced')))), React.createElement.apply(this, [
        'div',
        { 'className': 'cc-component__form' },
        _.map(this.food_types, repeatFood_type1.bind(this))
    ]), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('button', {
        'onClick': this.router.previous.bind(this.router),
        'className': 'btn'
    }, this.t('Previous')), React.createElement('button', {
        'onClick': this.router.next.bind(this.router),
        'className': 'btn'
    }, this.t('Next'))));
}