import { createAction } from 'redux-act';

const ensureFootprintComputed = createAction('Ensure footprint is computed based on user input.'),
    footprintRetrieved = createAction('Computed footprint retrieved.'),
    userFootprintError = createAction('Error retrieving computed footprint.'),
    parseFootprintResult = createAction('Parse result parameters from compute footprint result.'),
    parseTakeactionResult = createAction('Parse take action result from compute footprint result.'),
    userFootprintUpdated = createAction('Update user footprint parameters.'),
    userFootprintReset = createAction('Reset user footprint.'),
    updatedFootprintComputed = createAction('Compute updated user footprint.'),
    updateTakeactionResult = createAction('Compute and update take action result.'),
    updateRemoteUserAnswers = createAction('Update remote user through User API.');

export { ensureFootprintComputed, footprintRetrieved, userFootprintError, parseFootprintResult, parseTakeactionResult, userFootprintUpdated, userFootprintReset, updatedFootprintComputed, updateTakeactionResult, updateRemoteUserAnswers };
