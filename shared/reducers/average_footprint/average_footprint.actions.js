import { createAction } from 'redux-act';

const ensureDefaults = createAction('Ensure defaults from Calc API are in store.');
const defaultsRetrieved = createAction('Defaults retrieved from Calc API.');
const defaultsRetrievalError = createAction('Error retrieving defaults from Calc API.');
const averageFootprintResetRequested = createAction('Request average footprint to be reset.');
const averageFootprintUpdated = createAction('Average footprint updated with given data.');

export { ensureDefaults, defaultsRetrieved, defaultsRetrievalError,
  averageFootprintResetRequested, averageFootprintUpdated };
