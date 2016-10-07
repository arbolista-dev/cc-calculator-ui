import { createAction } from 'redux-act';

const ensureFootprintComputed = createAction('Ensure footprint is computed based on user input.'),
    ensureUserFootprintRetrieved = createAction('Compute footprint results retrieved from Calc API.'),
    ensureUserFootprintError = createAction('Error retrieving compute footprint results from Calc API.'),
    parseFootprintResult = createAction('Parse result parameters from compute footprint results.'),
    parseTakeactionResult = createAction('Parse take action result from compute footprint results.'),
    userFootprintUpdated = createAction('Update user footprint parameters.'),
    userFootprintReset = createAction('Reset user footprint.'),
    updatedFootprintComputed = createAction('Compute updated user footprint.'),
    updateTakeactionResults = createAction('Compute and update take action results.');

export { ensureFootprintComputed, ensureUserFootprintRetrieved, ensureUserFootprintError, parseFootprintResult, parseTakeactionResult, userFootprintUpdated, userFootprintReset, updatedFootprintComputed, updateTakeactionResults };
