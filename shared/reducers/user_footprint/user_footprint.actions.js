import { createAction } from 'redux-act';

const ensureUserFootprintComputed = createAction('Ensure compute footprint results from Calc API are in store.'),
    ensureUserFootprintRetrieved = createAction('Compute footprint results retrieved from Calc API.'),
    ensureUserFootprintError = createAction('Error retrieving compute footprint results from Calc API.'),
    parseFootprintResult = createAction('Error retrieving compute footprint results from Calc API.'),
    userLocationUpdated = createAction('Set user location.');

export { ensureUserFootprintComputed, ensureUserFootprintRetrieved, ensureUserFootprintError, parseFootprintResult, userLocationUpdated };
