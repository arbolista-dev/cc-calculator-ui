import { createAction } from 'redux-act';

const ensureComputeFootprint = createAction('Ensure compute footprint results from Calc API are in store.'),
    computeFootprintRetrieved = createAction('Compute footprint results retrieved from Calc API.'),
    computeFootprintRetrievalError = createAction('Error retrieving compute footprint results from Calc API.'),
    parseFootprintResult = createAction('Error retrieving compute footprint results from Calc API.'),
    userLocationUpdated = createAction('Set user location.');

export { ensureComputeFootprint, computeFootprintRetrieved, computeFootprintRetrievalError, parseFootprintResult, userLocationUpdated };
