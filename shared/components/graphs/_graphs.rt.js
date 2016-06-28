import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', {
        'className': 'cc-component',
        'id': 'graphs'
    }, React.createElement('div', { 'id': 'graphs_total_summary' }, React.createElement('div', { 'id': 'graphs_total_summary_heading' }, this.t('Total')), React.createElement('div', { 'id': 'graphs_total_footprint' }, this.display_total_footprint), React.createElement('div', {
        'className': 'graphs__units',
        'dangerouslySetInnerHTML': { __html: this.t('units.tons_co2_per_year') }
    })), React.createElement('div', {
        'className': _({ hidden: !this.state.show_chart }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' ')
    }, React.createElement('div', { 'id': 'overview_chart' }), React.createElement('div', { 'className': 'chart-legend' }, React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/your-footprint-rect.png' }), '\n        ', this.t('footprint.your_footprint'), '\n      '), React.createElement('div', {}, React.createElement('img', { 'src': '/assets/img/average-footprint-rect.png' }), '\n        ', this.t('footprint.average_footprint'), '\n      '))), React.createElement('div', { 'id': 'graphs_category_stats' }, React.createElement('div', {}, React.createElement('div', {}, React.createElement('span', { 'className': 'graphs__category_stat' }, this.user_category_footprint), React.createElement('br', {}), React.createElement('span', {
        'className': 'graphs__units',
        'dangerouslySetInnerHTML': { __html: '&nbsp;' + this.t('units.tons_co2_per_year') }
    })), React.createElement('div', { 'className': 'graphs__category_byline' }, this.category_total_byline)), React.createElement('div', {}, React.createElement('button', {
        'className': 'btn btn-default' + ' ' + _({ 'graphs--active': this.state.show_chart }).transform(function (res, value, key) {
            if (value) {
                res.push(key);
            }
        }, []).join(' '),
        'onClick': this.toggleChart.bind(this)
    }, React.createElement('i', { 'className': 'fa fa-bar-chart' }))), React.createElement('div', {}, React.createElement('div', { 'className': 'graphs__category_stat' }, '\n        ', this.display_category_percent, '%\n      '), React.createElement('div', { 'className': 'graphs__category_byline' }, this.category_percentage_byline))));
}