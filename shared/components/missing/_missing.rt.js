import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', { 'className': 'alert alert-danger' }, this.t('route_doesnt_exist'));
}