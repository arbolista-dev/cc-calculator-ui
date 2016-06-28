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
    }, React.createElement('div', { 'className': 'input-group' }, React.createElement('div', { 'className': 'input-group-btn' }, React.createElement('button', {
        'type': 'button',
        'className': 'btn btn-default dropdown-toggle',
        'data-toggle': 'dropdown'
    }, '\n                ', this.displayFuelType(vehicle), ' ', React.createElement('span', { 'className': 'caret' })), React.createElement('ul', { 'className': 'dropdown-menu' }, React.createElement('li', {}, React.createElement('a', {
        'href': '#',
        'onClick': this.updateVehicleFuelType.bind(this, vehicle, '1')
    }, '\n                    ', this.t('travel.gasoline'), '\n                  ')), React.createElement('li', {}, React.createElement('a', {
        'href': '#',
        'onClick': this.updateVehicleFuelType.bind(this, vehicle, '2')
    }, '\n                  ', this.t('travel.diesel'), '\n                  '))))    /*  /btn-group  */, React.createElement('input', {
        'className': 'form-control',
        'data-key': 'miles',
        'value': vehicle.display_miles,
        'placeholder': this.t('travel.miles_per_year'),
        'onChange': this.updateVehicle.bind(this, vehicle)
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.miles_per_year')), React.createElement('span', { 'className': 'input-group-btn' }, React.createElement('button', {
        'type': 'button',
        'className': 'btn btn-danger',
        'onClick': this.removeVehicle.bind(this, vehicle)
    }, 'X'))), React.createElement('span', { 'className': 'label label-slider' }, vehicle.display_mpg, ' ', React.createElement('i', {}, this.t('travel.miles_per_gallon'))), React.createElement('div', {
        'className': 'vehicle-slider__container',
        'id': vehicle.slider_id
    }));
}
export default function () {
    return React.createElement('main', {
        'className': 'cc-component container container-md',
        'id': 'travel'
    }, React.createElement('header', { 'className': 'cc-component__header' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/' + this.route_key + '-black.svg' }), React.createElement('h4', {}, this.t('travel.title'))), React.createElement('span', { 'className': 'cc-component__byline' }, this.t('travel.byline'))), React.createElement('div', { 'className': 'cc-component__form' }, React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, '\n        ', this.t('travel.your_vehicles'), '\n        ', React.createElement('button', mergeProps({
        'className': 'btn btn-default btn-xs',
        'onClick': this.addVehicle.bind(this)
    }, { disabled: this.vehicles_maxed }), React.createElement('i', { 'className': 'fa fa-plus' }), '.\n          ', this.t('add'), '\n        ')), React.createElement.apply(this, [
        'div',
        { 'className': 'panel panel-body' },
        _.map(this.vehicles, repeatVehicle2.bind(this))
    ])), React.createElement('div', { 'className': 'cc-simple-advanced-container' }, React.createElement('span', {
        'className': 'cc-component__simple-toggle' + ' ' + _({ 'cc-component__simple-toggle--active': this.state.simple }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onClick': this.setSimple.bind(this)
    }, this.t('component.labels.simple')), ' |\n      ', React.createElement('span', {
        'className': 'cc-component__simple-toggle' + ' ' + _({ 'cc-component__simple-toggle--active': !this.state.simple }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onClick': this.setAdvanced.bind(this)
    }, this.t('component.labels.advanced'))), this.simple ? React.createElement('div', {}, React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('travel.publictrans.label')), React.createElement('div', { 'className': 'panel-body' }, React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('publictrans'),
        'data-api_key': 'input_footprint_transportation_publictrans'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.miles_per_year'))))), React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('travel.air.label')), React.createElement('div', { 'className': 'panel-body' }, React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('airtotal'),
        'data-api_key': 'input_footprint_transportation_airtotal'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.miles_per_year')))))) : null, !this.simple ? React.createElement('div', {}, React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('travel.publictrans.label')), React.createElement('div', { 'className': 'panel-body' }, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.publictrans.bus')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('bus'),
        'data-api_key': 'input_footprint_transportation_bus'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.miles_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.publictrans.transit_rail')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('transit'),
        'data-api_key': 'input_footprint_transportation_transit'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.miles_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.publictrans.commuter_rail')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('commuter'),
        'data-api_key': 'input_footprint_transportation_commuter'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.miles_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.publictrans.inter_city_rail')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('intercity'),
        'data-api_key': 'input_footprint_transportation_intercity'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.miles_per_year')))))), React.createElement('div', { 'className': 'panel panel-default' }, React.createElement('div', { 'className': 'panel-heading' }, this.t('travel.air.label')), React.createElement('div', { 'className': 'panel-body' }, React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.air.short')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('airshort'),
        'data-api_key': 'input_footprint_transportation_airshort'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.flights_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.air.medium')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('airmedium'),
        'data-api_key': 'input_footprint_transportation_airmedium'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.flights_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.air.long')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('airlong'),
        'data-api_key': 'input_footprint_transportation_airlong'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.flights_per_year')))), React.createElement('div', { 'className': 'cc-component__question' }, React.createElement('h5', {}, this.t('travel.air.extended')), React.createElement('div', { 'className': 'input-group' }, React.createElement('input', {
        'className': 'form-control',
        'onChange': this.updateFootprintInput.bind(this),
        'value': this.displayUserApiStateValue('airextended'),
        'data-api_key': 'input_footprint_transportation_airextended'
    }), React.createElement('span', { 'className': 'input-group-addon' }, this.t('travel.flights_per_year'))))))) : null), React.createElement('div', { 'className': 'cc-component__nav' }, React.createElement('a', { 'onClick': this.router.previous.bind(this.router) }, this.t('Previous')), React.createElement('a', { 'onClick': this.router.next.bind(this.router) }, this.t('Next'))));
}