/*global JS_ENV Map require*/

export default class StateManager {

  constructor(){
    var state_manager = this;
    state_manager.state = {};
  }

  get params(){
    return this.state.route.params;
  }

  setRoute(route){
    let state_manager = this;
    state_manager.state.route = route;
    return Promise.resolve();
  }

  getInitialData(){
    // we'll load past user answers and get CC results here.
    return Promise.resolve();
  }


}
