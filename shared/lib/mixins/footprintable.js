/*global clearTimeout setTimeout*/

export let footprintable = {

  isUserFootprintSet(){
    return !this.getUserFootprint().isEmpty()
  },

  getDefaultInputs(init){
    let default_inputs;
    if (!this.isUserFootprintSet() || init) {
      default_inputs = this.state_manager.default_inputs;
    } else if(this.user_authenticated) {
      default_inputs = {
        input_location_mode: this.userApiValue('input_location_mode'),
        input_location: this.userApiValue('input_location'),
        input_income: this.userApiValue('input_income'),
        input_size: this.userApiValue('input_size')
      }
    } else {
      default_inputs = {
        input_location_mode: this.defaultApiValue('input_location_mode'),
        input_location: this.defaultApiValue('input_location'),
        input_income: this.defaultApiValue('input_income'),
        input_size: this.defaultApiValue('input_size')
      }
    }
    return default_inputs;
  },

  getUserFootprint(){
    return this.props.user_footprint.get('data')
  },

  resetUserFootprint(){
    this.props.userFootprintReset();
  },

  apiKey(key_end){
    return `${this.api_key_base}_${key_end}`;
  },

  displayUserApiStateValue(api_suffix){
    let api_key = this.apiKey(api_suffix);
    return Math.round(this.state[api_key]);
  },

  userApiValue(api_key){
    let value = this.props.user_footprint.getIn(['data', api_key]);
    let number = parseInt(value);
    if (isNaN(number)) {
      return value;
    } else {
      return number;
    }
  },

  defaultApiValue(api_key){
    let value = this.props.average_footprint.getIn(['data', api_key]);
    let number = parseInt(value);
    if (isNaN(number)) {
      return value;
    } else {
      return number;
    }
  },

  userApiState(){
    let component = this;
    return component.relevant_api_keys.reduce((hash, api_suffix)=>{
      let api_key = component.apiKey(api_suffix);
      hash[api_key] = component.userApiValue(api_key);
      return hash;
    }, {});
  },

  totalTakeactionSavings(savings_type){
    let component = this;
    return Object.keys(component.props.user_footprint.get('result_takeaction_pounds').toJS())
      .filter(key=> !/^offset_/.test(key))
      .reduce((sum, action_key)=>{
        if (component.userApiValue(`input_takeaction_${action_key}`) == 1){
          sum += component.props.user_footprint.getIn([savings_type, action_key]);
        }
        return sum;
      }, 0) || 0;
  },

  popoverContentForCategory(category){
    let component = this,
        key;
    switch(category){
    case 'travel':
      key = 'result_transport_total';
      break;
    case 'home':
      key = 'result_housing_total';
      break;
    case 'food':
      key = 'result_food_total';
      break;
    case 'services':
      key = 'result_services_total';
      break;
    case 'goods':
      key = 'result_goods_total';
      break;
    }
    let category_value = component.userApiValue(key),
        total_value = component.userApiValue('result_grand_total'),
        display_category = component.numberWithCommas(
          Math.round(category_value)
        ),
        display_percent = Math.round(100 * category_value / total_value);
    return `
      <dl>
        <dt>${component.t('categories.' + key)}</dt>
        <dd>${display_category} ${component.t('units.tons_co2_per_year')}</dd>
        <dt>${component.t('percent_of_total')}</dt>
        <dd>${display_percent}%</dd>
      </dl>
    `;
  },

  displayTakeactionSavings(savings_type){
    let total = this.totalTakeactionSavings(savings_type);
    if (savings_type === 'result_takeaction_pounds'){
      total = Math.round(total * 100) / 100;
    } else {
      total = Math.round(total);
    }
    return this.numberWithCommas(total);
  },

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  updateAverageFootprintParams(updated_params){
    this.props.averageFootprintUpdated(updated_params);
  },

  updateFootprintParams(updated_params){
    this.props.userFootprintUpdated(updated_params);
  },

  updateFootprintInput(event){
    let component = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };
    component.setState(update);
    component.updateFootprint(update);
  },

  updateFootprint(params){
    let component = this;

    component.updateFootprintParams(params);

    if (component.$update_footprint) {
      clearTimeout(component.$update_footprint);
    }

    component.$update_footprint = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      component.props.updatedFootprintComputed(component.getUserFootprint())
    }, 500);
  }

}
