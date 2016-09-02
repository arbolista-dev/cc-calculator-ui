export let footprintable = {

  apiKey: function(key_end){
    return `${this.api_key_base}_${key_end}`;
  },

  displayUserApiStateValue(api_suffix){
    let api_key = this.apiKey(api_suffix);
    return Math.round(this.state[api_key]);
  },

  userApiValue: function(api_key){
    console.log('userApiValue for: ' + api_key + '=' + this.props.user_footprint.getIn(['data', api_key]));
    return this.props.user_footprint.getIn(['data', api_key]);
  },

  defaultApiValue: function(api_key){
    return this.props.average_footprint.getIn(['data', api_key]);
  },

  userApiState: function(){
    let component = this;
    return component.relevant_api_keys.reduce((hash, api_suffix)=>{
      let api_key = component.apiKey(api_suffix);
      hash[api_key] = component.userApiValue(api_key);
      return hash;
    }, {});
  },

  totalTakeactionSavings(savings_type){
    let component = this;
    return Object.keys(component.state_manager.result_takeaction_pounds)
        .filter(key=> !/^offset_/.test(key))
        .reduce((sum, action_key)=>{
          if (component.userApiValue(`input_takeaction_${action_key}`) == 1){
            sum += component.state_manager[savings_type][action_key];
          }
          return sum;
        }, 0) || 0;
  },

  popoverContentForCategory: function(category){
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

  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  // updateFootprintParams(params){
  //   this.state_manager.updateFootprintParams(params);
  // },
  updateFootprintParams(updated_params){
    console.log('footprintable - updateFootprintParams');
    this.props.averageFootprintUpdated(updated_params);
    this.props.userFootprintUpdated(updated_params);
  },

  updateFootprintInput: function(event){
    let component = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };
    component.setState(update);
    component.updateFootprint(update);
  },

  updateFootprint: function(params){
    let component = this;

    component.state_manager.update_in_progress = true;
    component.updateFootprintParams(params);

    // debounce updating footprint by 500ms.
    if (component.$update_footprint) {
      clearTimeout(component.$update_footprint);
    }

    component.$update_footprint = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      component.state_manager.updateFootprint()
        .then(()=>{
          component.state_manager.syncLayout();
        })
        .then(()=>{
          let user_api_state = component.userApiState();
          component.setState(user_api_state, ()=>{
            component.state_manager.update_in_progress = false;
          })
        });
    }, 500);
  }

}
