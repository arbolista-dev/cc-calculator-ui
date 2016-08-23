import * as Immutable from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createAction, createReducer } from 'redux-act';

const ensureAverageFootprint = createAction('Ensure average footprint is in store.');

export { ensureAverageFootprint };

const ACTIONS = {

  // Set average footprint
  [ensureAverageFootprint]: (default_data, data)=>{
    return Immutable.fromJS({average_footprint: data});
  };

};

const REDUCER = createReducer(ACTIONS, 0);

export default REDUCER;
