import React from 'react';
import _ from 'lodash';
function repeatGoods_type1(goods_type, goods_typeIndex) {
    return React.createElement('div', {
        'key': 'shopping_question_' + goods_type,
        'className': 'cc-component__question'
    }, React.createElement('h4', { 'className': 'cc-component__question-label' }, this.t(`shopping.${ goods_type }.label`)), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'onChange': this.updateMonthlyExpenditure.bind(this),
        'value': this.displayUserApiStateValue(goods_type),
        'placeholder': this.t('units.usd_per_month') + '}',
        'data-type': goods_type,
        'data-api_key': this.apiKey(goods_type),
        'className': 'form-control'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('units.usd_per_month'))));
}
function repeatService_type2(service_type, service_typeIndex) {
    return React.createElement('div', {
        'key': 'shopping_question_' + service_type,
        'className': 'cc-component__question'
    }, React.createElement('h4', { 'className': 'cc-component__question-label' }, this.t(`shopping.${ service_type }.label`)), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'onChange': this.updateMonthlyExpenditure.bind(this),
        'value': this.displayUserApiStateValue(service_type),
        'placeholder': this.t('units.usd_per_month') + '}',
        'data-type': service_type,
        'data-api_key': this.apiKey(service_type),
        'className': 'form-control'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('units.usd_per_month'))));
}
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-md',
        'id': 'shopping'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '-black.svg' }), React.createElement('h4', {}, this.t('shopping.title'))), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('shopping.byline')), React.createElement('div', {}, React.createElement('span', {
        'className': 'cc-component__simple-toggle' + ' ' + _({ 'cc-component__simple-toggle--active': this.state.simple }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onClick': this.setSimple.bind(this)
    }, this.t('component.labels.simple')), ' |\n\t\t\t', React.createElement('span', {
        'className': 'cc-component__simple-toggle' + ' ' + _({ 'cc-component__simple-toggle--active': !this.state.simple }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onClick': this.setAdvanced.bind(this)
    }, this.t('component.labels.advanced')))), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', {
        'className': _({ hidden: this.advanced }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }, React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('shopping.goods.label')), React.createElement('div', { 'className': 'panel-body' }, React.createElement('span', { 'className': 'label label-slider' }, '\n\t\t\t\t\t\t$', this.display_goods_monthly_spending, ' / ', this.t('month'), '\n\t\t\t\t\t'), React.createElement('div', { 'id': 'shopping_goods_slider' }))), React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('shopping.services.label')), React.createElement('div', { 'className': 'panel-body' }, React.createElement('span', { 'className': 'label label-slider' }, '\n\t\t\t\t\t\t$', this.display_services_monthly_spending, ' / ', this.t('month'), '\n\t\t\t\t\t'), React.createElement('div', { 'id': 'shopping_services_slider' })))), React.createElement('div', {
        'className': _({ hidden: this.simple }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }, React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('shopping.goods.label')), React.createElement.apply(this, [
        'div',
        { 'className': 'panel-body' },
        _.map(this.goods_questions, repeatGoods_type1.bind(this))
    ])), React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('shopping.services.label')), React.createElement.apply(this, [
        'div',
        { 'className': 'panel-body' },
        _.map(this.services_questions, repeatService_type2.bind(this))
    ])))), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.previous.bind(this.router) }, this.t('Previous')), React.createElement('a', { 'onClick': this.router.next.bind(this.router) }, this.t('Next'))));
}