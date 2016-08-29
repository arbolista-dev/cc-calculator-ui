import * as Immutable from 'immutable';
import { loop, Effects } from 'redux-loop';
import { createReducer } from 'redux-act';

import { ensureAverageFootprint } from './average_footprint.actions'

const ACTIONS = {

  // Set average footprint
  [ensureAverageFootprint]: (default_data, data)=>{
    return Immutable.fromJS({average_footprint: data});
  };

};

const REDUCER = createReducer(ACTIONS, 0);

export default REDUCER;
