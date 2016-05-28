import React from 'react';
import _ from 'lodash';
function repeatGoods_type1(goods_type, goods_typeIndex) {
    return React.createElement('div', {
        'key': 'shopping_question_' + goods_type,
        'className': 'cc-component__question'
    }, React.createElement('h4', { 'className': 'cc-component__question-label' }, this.t(`shopping.${ goods_type }.label`)), React.createElement('input', {
        'onChange': this.updateMonthlyExpenditure.bind(this),
        'value': this.displayUserApiStateValue(goods_type),
        'placeholder': this.t('units.usd_per_month') + '}',
        'data-type': goods_type,
        'data-api_key': this.apiKey(goods_type),
        'className': 'cc-component__question-input'
    }));
}
function repeatService_type2(service_type, service_typeIndex) {
    return React.createElement('div', {
        'key': 'shopping_question_' + service_type,
        'className': 'cc-component__question'
    }, React.createElement('h4', { 'className': 'cc-component__question-label' }, this.t(`shopping.${ service_type }.label`)), React.createElement('input', {
        'onChange': this.updateMonthlyExpenditure.bind(this),
        'value': this.displayUserApiStateValue(service_type),
        'placeholder': this.t('units.usd_per_month') + '}',
        'data-type': service_type,
        'data-api_key': this.apiKey(service_type),
        'className': 'cc-component__question-input'
    }));
}
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'shopping'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.t('shopping.title'))), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('shopping.byline')), React.createElement('div', {}, React.createElement('span', {
        'className': 'cc-component__simple-toggle',
        'onClick': this.setSimple.bind(this)
    }, this.t('component.labels.simple')), ' |\n      ', React.createElement('span', {
        'className': 'cc-component__simple-toggle',
        'onClick': this.setAdvanced.bind(this)
    }, this.t('component.labels.advanced')))), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', {
        'className': _({ hidden: this.advanced }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }, React.createElement('h3', {}, this.t('shopping.goods.label')), React.createElement('div', { 'id': 'shopping_goods_slider' }), React.createElement('h3', {}, this.t('shopping.services.label')), React.createElement('div', { 'id': 'shopping_services_slider' })), React.createElement.apply(this, [
        'div',
        {
            'className': _({ hidden: this.simple }).transform(function (res, value, key) {
                if (value) {
                    res.push(key);
                }
            }, []).join(' ')
        },
        React.createElement('h4', {}, this.t('shopping.goods.label')),
        React.createElement('p', {}, this.t('shopping.enter_data_help')),
        _.map(this.goods_questions, repeatGoods_type1.bind(this)),
        React.createElement('h4', {}, this.t('shopping.services.label')),
        React.createElement('p', {}, this.t('shopping.enter_data_help')),
        _.map(this.services_questions, repeatService_type2.bind(this))
    ])), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('button', {
        'onClick': this.router.previous.bind(this.router),
        'className': 'btn'
    }, this.t('Previous')), React.createElement('button', {
        'onClick': this.router.next.bind(this.router),
        'className': 'btn'
    }, this.t('Next'))));
}