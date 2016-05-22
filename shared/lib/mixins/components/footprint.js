export const footprint = {

  updateFootprintInput: function(event){
    let component = this,
        api_key = event.target.dataset.api_key,
        new_value = event.target.value;
    component.updateFootprint({[api_key]: new_value});
  },

  updateFootprint: function(params){
    let component = this;
    console.log('new params', params)
    component.state_manager.updateFootprintParams(params);

    // debounce updating footprint by 500ms.
    if (component.$update_footprint) {
      clearTimeout(component.$update_footprint);
    }

    component.$update_footprint = setTimeout(()=>{
      // This will also make necessary update to user footprint.
      component.state_manager.updateFootprint();
    }, 500);
  }
};
