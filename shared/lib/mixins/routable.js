export let routable = {

  goTo: (url)=>{
    this.router.goTo(url);
  },

  goToRoute: (route, event)=>{
    let component = this;
    if (component.state_manager.update_in_progress) return false;
    return component.router.goToRoute(route);
  }

};
