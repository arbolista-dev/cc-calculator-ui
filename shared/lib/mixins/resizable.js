/*global window clearTimeout setTimeout*/

/*
 * Window resizing.
 * Components must implement their own on resize event.
 */
export let resizable = {

  initResizeListener(){
    let component = this;
    component.cachedWidth = window.innerWidth;
    window.addEventListener('resize', ()=>{
      // just the debounce function.
      component.$resize();
    }, true);
  },

  // debounce function
  $resize(){
    let component = this;

    if (component.$on_resize){
      clearTimeout(component.$on_resize);
    }

    component.$on_resize = setTimeout(()=>{
      if (component.windowSizeHasChanged()){
        component.cachedWidth = window.innerWidth;
        component.resize();
      }
    }, component.resize_debounce_ms || 250);
  },

  windowSizeHasChanged(){
    return Math.abs((this.cachedWidth - window.innerWidth) / window.innerWidth) > 0.05;
  }

};
