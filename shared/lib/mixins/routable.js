export let routable = {

  goTo: (url)=>{
    this.router.goTo(url);
  },

  goToRoute: (route)=>{
    let component = this;
    return component.router.goToRoute(route);
  }

};
