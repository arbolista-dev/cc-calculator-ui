import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-sm',
        'id': 'home'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('h2', {}, this.t('home.title'))), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('home.byline'))), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t(`home.electricity.label`)), React.createElement('input', {
        'className': 'form-control' + ' ' + _({ hidden: !this.unitsSet('electricity', 0) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_electricity_dollars,
        'placeholder': this.defaultCategoryInput('electricity_dollars'),
        'data-api_key': 'input_footprint_housing_electricity_dollars'
    }), React.createElement('input', {
        'className': 'form-control' + ' ' + _({ hidden: !this.unitsSet('electricity', 1) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_electricity_kwh,
        'placeholder': this.defaultCategoryInput('electricity_kwh'),
        'data-api_key': 'input_footprint_housing_electricity_kwh'
    }), React.createElement('select', {
        'onChange': this.setUnits.bind(this),
        'data-api_key': 'input_footprint_housing_electricity_type',
        'value': this.state.input_footprint_housing_electricity_type
    }, React.createElement('option', { 'value': '0' }, this.t('units.usd_per_year')), React.createElement('option', { 'value': '1' }, this.t('units.kwh_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t(`home.cleanpercent.label`)), React.createElement('div', { 'id': 'home_cleanpercent_slider' })), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t(`home.naturalgas.label`)), React.createElement('input', {
        'className': 'form-control' + ' ' + _({ hidden: !this.unitsSet('naturalgas', 0) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_naturalgas_dollars,
        'placeholder': this.defaultCategoryInput('naturalgas_dollars'),
        'data-api_key': 'input_footprint_housing_naturalgas_dollars'
    }), React.createElement('input', {
        'className': 'form-control' + ' ' + _({ hidden: !this.unitsSet('naturalgas', 1) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_naturalgas_therms,
        'placeholder': this.defaultCategoryInput('naturalgas_therms'),
        'data-api_key': 'input_footprint_housing_naturalgas_therms'
    }), React.createElement('input', {
        'className': 'form-control' + ' ' + _({ hidden: !this.unitsSet('naturalgas', 2) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_naturalgas_cuft,
        'placeholder': this.defaultCategoryInput('naturalgas_cuft'),
        'data-api_key': 'input_footprint_housing_naturalgas_cuft'
    }), React.createElement('select', {
        'onChange': this.setUnits.bind(this),
        'data-api_key': 'input_footprint_housing_naturalgas_type',
        'value': this.state.input_footprint_housing_naturalgas_type
    }, React.createElement('option', { 'value': '0' }, this.t('units.usd_per_year')), React.createElement('option', { 'value': '1' }, this.t('units.therms_per_year')), React.createElement('option', { 'value': '2' }, this.t('units.cuft_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t(`home.heatingoil.label`)), React.createElement('input', {
        'className': 'form-control' + ' ' + _({ hidden: !this.unitsSet('heatingoil', 0) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_heatingoil_dollars,
        'placeholder': this.defaultCategoryInput('heatingoil_dollars'),
        'data-api_key': 'input_footprint_housing_heatingoil_dollars'
    }), React.createElement('input', {
        'className': 'form-control' + ' ' + _({ hidden: !this.unitsSet('heatingoil', 1) }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_heatingoil_gallons,
        'placeholder': this.defaultCategoryInput('heatingoil_gallons'),
        'data-api_key': 'input_footprint_housing_heatingoil_gallons'
    }), React.createElement('select', {
        'onChange': this.setUnits.bind(this),
        'data-api_key': 'input_footprint_housing_heatingoil_type',
        'value': this.state.input_footprint_housing_heatingoil_type
    }, React.createElement('option', { 'value': '0' }, this.t('units.usd_per_year')), React.createElement('option', { 'value': '1' }, this.t('units.gallons_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t(`home.squarefeet.label`)), React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.state.input_footprint_housing_squarefeet,
        'placeholder': this.t('units.usd_per_year'),
        'data-api_key': 'input_footprint_housing_squarefeet'
    })), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('div', { 'className': 'cc-component__question-label' }, this.t(`home.watersewage.label`)), React.createElement('div', { 'id': 'home_watersewage_slider' }), React.createElement('div', {}, this.display_annual_water_dollars, ' ', React.createElement('i', {}, this.t('units.usd_per_year'))))), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.previous.bind(this.router) }, this.t('Previous')), React.createElement('a', { 'onClick': this.router.next.bind(this.router) }, this.t('Next'))));
}