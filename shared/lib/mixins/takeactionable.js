export let takeactionable = {

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
    let component = this,
    hash = {};
    // return component.relevant_api_keys.reduce((hash, api_suffix)=>{
    //   let api_key = component.apiKey(api_suffix);
    //   hash[api_key] = component.userApiValue(api_key);
    //   return hash;
    // }, {});
    // hash[component.api_key] = component.userApiValue(component.api_key);
    // return hash;

    let keys = Object.keys(component.state_manager.state.user_footprint)
      .filter(key=> key.includes(component.result_key))

    console.log('----- fp', component.state_manager.state.user_footprint)
    console.log('----- result key', component.result_key)
    return keys.reduce((hash, api_key)=>{
      hash[api_key] = component.userApiValue(api_key);
      console.log('USER API STATE: ', hash)
      return hash;
    }, {});
    // return Object.keys(component.state_manager.user_footprint)
    //   .filter(key=> key.includes(component.result_key))
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

  updateTakeaction(params){
    console.log('updateTakeaction this:', this)
    let take_action = this;

    take_action.state_manager.update_in_progress = true;
    take_action.updateFootprintParams(params);

    // debounce updating take action results by 500ms.
    if (take_action.$update_takeaction) {
      clearTimeout(take_action.$update_takeaction);
    }

    take_action.$update_takeaction = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      take_action.state_manager.updateTakeactionResults()
        .then(()=> {
          take_action.state_manager.update_in_progress = false;
        })
    }, 500);
  }

}
