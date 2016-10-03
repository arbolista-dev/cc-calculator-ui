export let routable = {

  goTo: (url)=>{
    this.router.goTo(url);
  },

  goToRoute: (route, event)=>{
    let component = this;
    return component.router.goToRoute(route);
  }

};
