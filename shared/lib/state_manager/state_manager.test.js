/*global describe beforeEach it expect*/

import ExampleRoute from './../routes/example/example';
import StateManager from './state_manager';

let example_route = new ExampleRoute();

describe('StateManager', ()=>{
  let state_manager = new StateManager();
  beforeEach((done)=>{
    example_route.params = {example_id: '4'}
    state_manager.setRoute(example_route)
      .then(done);
  });

  it('can set route', ()=>{
    expect(state_manager.state.route).toEqual(example_route);
  });

  it('can check state example id', ()=>{
    expect(state_manager.exampleSet(4)).toEqual(true);
  });

  it('can access route params', ()=>{
    expect(state_manager.params).toEqual(example_route.params);
  });

});


