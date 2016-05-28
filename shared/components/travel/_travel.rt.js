import React from 'react';
import _ from 'lodash';
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
function repeatVehicle2(vehicle, vehicleIndex) {
    return React.createElement('div', {
        'className': 'cc-component__question cc-component__question--vehicle',
        'key': vehicle.id
    }, React.createElement('select', {
        'data-key': 'fuel_type',
        'value': vehicle.fuel_type,
        'onChange': this.updateVehicle.bind(this, vehicle)
    }, React.createElement('option', { 'value': '1' }, this.t('travel.gasoline')), React.createElement('option', { 'value': '2' }, this.t('travel.diesel'))), React.createElement('input', {
        'data-key': 'miles',
        'value': vehicle.display_miles,
        'placeholder': this.t('travel.miles_per_year'),
        'onChange': this.updateVehicle.bind(this, vehicle)
    }), React.createElement('div', { 'id': vehicle.slider_id }), React.createElement('div', { 'className': 'question--vehicle__mpg-label' }, vehicle.display_mpg, ' ', React.createElement('i', {}, this.t('travel.miles_per_gallon'))), React.createElement('span', {
        'className': 'label label-danger',
        'onClick': this.removeVehicle.bind(this, vehicle)
    }, React.createElement('i', { 'className': 'fa fa-minus' })));
}
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'travel'
    }, React.createElement('div', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '.png' }), React.createElement('span', {}, this.t('travel.title'))), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('travel.byline')), React.createElement('div', {}, React.createElement('span', {
        'className': 'cc-component__simple-toggle',
        'onClick': this.setSimple.bind(this)
    }, this.t('component.labels.simple')), ' |\n      ', React.createElement('span', {
        'className': 'cc-component__simple-toggle',
        'onClick': this.setAdvanced.bind(this)
    }, this.t('component.labels.advanced')))), React.createElement.apply(this, [
        'div',
        { 'className': 'cc-component__form' },
        React.createElement('div', { 'id': 'travel_add_vehicle' }, React.createElement('button', mergeProps({
            'className': 'btn btn-default',
            'onClick': this.addVehicle.bind(this)
        }, { disabled: this.vehicles_maxed }), React.createElement('i', { 'className': 'fa fa-plus' })), '\n      ', this.t('travel.add_vehicle'), '\n    '),
        _.map(this.vehicles, repeatVehicle2.bind(this)),
        this.simple ? React.createElement('div', {}, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h3', { 'className': 'cc-component__question-label' }, this.t('travel.publictrans.label')), React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('publictrans'),
            'data-api_key': 'input_footprint_transportation_publictrans',
            'className': 'cc-component__question-input--right'
        })), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h3', { 'className': 'cc-component__question-label' }, this.t('travel.air.label')), React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('airtotal'),
            'data-api_key': 'input_footprint_transportation_airtotal',
            'className': 'cc-component__question-input--right'
        }))) : null,
        !this.simple ? React.createElement('div', {}, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h3', { 'className': 'cc-component__question-label' }, this.t('travel.publictrans.label')), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('bus'),
            'data-api_key': 'input_footprint_transportation_bus'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.publictrans.bus'))), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('transit'),
            'data-api_key': 'input_footprint_transportation_transit'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.publictrans.transit_rail'))), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('commuter'),
            'data-api_key': 'input_footprint_transportation_commuter'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.publictrans.commuter_rail'))), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('intercity'),
            'data-api_key': 'input_footprint_transportation_intercity'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.publictrans.inter_city_rail')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h3', { 'className': 'cc-component__question-label' }, this.t('travel.air.label')), React.createElement('h4', { 'className': 'cc-component__question-label' }, this.t('travel.air.advanced_sub_label')), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('airshort'),
            'data-api_key': 'input_footprint_transportation_airshort'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.air.short'))), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('airmedium'),
            'data-api_key': 'input_footprint_transportation_airmedium'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.air.medium'))), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('airlong'),
            'data-api_key': 'input_footprint_transportation_airlong'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.air.long'))), React.createElement('div', { 'className': 'cc-component__sub-question' }, React.createElement('input', {
            'onChange': this.updateFootprintInput.bind(this),
            'value': this.displayUserApiStateValue('airextended'),
            'data-api_key': 'input_footprint_transportation_airextended'
        }), React.createElement('div', { 'className': 'cc-component__sub-question-label' }, this.t('travel.air.extended'))))) : null
    ]), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('button', {
        'onClick': this.router.previous.bind(this.router),
        'className': 'btn'
    }, this.t('Previous')), React.createElement('button', {
        'onClick': this.router.next.bind(this.router),
        'className': 'btn'
    }, this.t('Next'))));
}