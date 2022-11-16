import React, { PropTypes } from 'react';
import Translatable from 'shared/lib/base_classes/translatable';
import footprintContainer from 'shared/containers/footprint.container';
import template from './filters.rt.html';

class Filters extends Translatable {

  setFilters(category, value) {
    const { filter, filters } = this.props;
    let update = filters.set(category, value);
    if (!value) update = update.delete(category);
    if (category === 'relevance' && value === 'not_relevant') {
      update = update.delete('status');
    } else if (category === 'status' && value) {
      update = update.delete('relevance');
    }
    filter(update);
  }

  render() {
    return template.call(this);
  }

}

Filters.propTypes = {
  visible: PropTypes.bool.isRequired,
  filter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

module.exports = footprintContainer(Filters);
