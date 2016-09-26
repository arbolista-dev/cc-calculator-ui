import { createAction } from 'redux-act';

const ensureDefaults = createAction('Ensure defaults from Calc API are in store.'),
    defaultsRetrieved = createAction('Defaults retrieved from Calc API.'),
    defaultsRetrievalError = createAction('Error retrieving defaults from Calc API.'),
    averageFootprintUpdated = createAction('Average footprint updated with given data.');

export { ensureDefaults, defaultsRetrieved, defaultsRetrievalError, averageFootprintUpdated };
