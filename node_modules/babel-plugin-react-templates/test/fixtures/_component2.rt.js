import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', {}, React.createElement('h2', {}, 'Component2'), React.createElement('p', {}, 'Hi, Component1 passed me ', this.props.prop2));
};