export let footprintable = {

  apiKey: function(key_end){
    return `${this.api_key_base}_${key_end}`;
  },

  displayUserApiStateValue(api_suffix){
    let api_key = this.apiKey(api_suffix);
    return Math.round(this.state[api_key]);
  },

  userApiValue: function(api_key){
    return this.state_manager.user_footprint[api_key];
  },

  defaultApiValue: function(api_key){
    return this.state_manager.average_footprint[api_key];
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
    return Math.round(
        Object.keys(component.state_manager.result_takeaction_pounds)
        .filter(key=> !/^offset_/.test(key))
        .reduce((sum, action_key)=>{
          if (component.userApiValue(`input_takeaction_${action_key}`) == 1){
            sum += component.state_manager[savings_type][action_key];
          }
          return sum;
        }, 0)) || 0;
  },

  displayTakeactionSavings(savings_type){
    return this.numberWithCommas(this.totalTakeactionSavings(savings_type));
  },

  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  updateFootprintParams(params){
    this.state_manager.updateFootprintParams(params);
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
    component.updateFootprintParams(params);

    // debounce updating footprint by 500ms.
    if (component.$update_footprint) {
      clearTimeout(component.$update_footprint);
    }

    component.$update_footprint = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      component.state_manager.updateFootprint()
        .then(()=>{
          let user_api_state = component.userApiState();
          component.setState(user_api_state)
        });
    }, 500);
  }

}

