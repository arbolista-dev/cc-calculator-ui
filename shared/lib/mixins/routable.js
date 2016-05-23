export let routable = {

  goTo: function(url){
    this.router.goTo(url);
  },

  goToRoute: function(route, _event){
    let layout = this;
    return layout.router.goToRoute(route);
  }

};
