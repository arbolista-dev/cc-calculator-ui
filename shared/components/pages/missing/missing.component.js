/* global module*/

import React from 'react';
import Translatable from 'shared/lib/base_classes/translatable';
import template from './missing.rt.html';

class MissingComponent extends Translatable {

  constructor(props, context) {
    super(props, context);
    const missing = this;
    missing.state = {};
  }

  render() {
    return template.call(this);
  }

}

MissingComponent.propTypes = {};
MissingComponent.NAME = 'Missing';

module.exports = MissingComponent;
