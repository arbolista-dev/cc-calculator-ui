/*
 * Window resizing.
 * Components must implement their own on resize event.
 */
export let resizable = {

  initResizeListener: function(){
    let component = this;
    let cachedWidth = window.innerWidth;
    window.addEventListener('resize', ()=>{
      if (cachedWidth !== window.innerWidth) {
        // just the debounce function.
        component.$resize();
      }
    }, true);
  },

  // debounce function
  $resize: function(){
    let component = this;

    if (component.$on_resize){
      clearTimeout(component.$on_resize);
    }

    component.$on_resize = setTimeout(()=>{
      component.resize();
    }, component.resize_debounce_ms || 250);
  }
};
