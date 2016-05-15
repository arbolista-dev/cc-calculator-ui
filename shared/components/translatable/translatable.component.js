/*global module*/

import React from 'react';

class TranslatableComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    // TODO: implement this as abstract class
    // once new.target starts working
  }

  get t() {
    var i18n = this.context.i18n;
    if (!i18n) {
      // i18n not present - probably unit test
      return (key) => {
        // no translation - used for checking the keys
        return key;
      };
    } else {
      // TODO: implement language switching
      return i18n.getFixedT(i18n.language, 'translations');
    }
  }

  get i18next() {
    return this.context.i18n;
  }
}

TranslatableComponent.contextTypes = {
  i18n: React.PropTypes.any
};

TranslatableComponent.NAME = 'Translatable';

module.exports = TranslatableComponent;
