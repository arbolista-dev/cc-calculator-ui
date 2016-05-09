import React from 'react';
import _ from 'lodash';
import Component2 from './component2';
export default function () {
    return React.createElement('div', {}, React.createElement('h1', {}, 'Component1'), React.createElement('p', {}, 'Someone passed me "', this.props.prop1, '".'), React.createElement(Component2, { 'prop2': this.prop2 }));
};