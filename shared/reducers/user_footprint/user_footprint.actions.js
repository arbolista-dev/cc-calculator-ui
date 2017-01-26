import { createAction } from 'redux-act';

const ensureFootprintComputed = createAction('Ensure footprint is computed based on user input.');
const footprintRetrieved = createAction('Computed footprint retrieved.');
const userFootprintError = createAction('Error retrieving computed footprint.');
const parseFootprintResult = createAction('Parse result parameters from compute footprint result.');
const parseTakeactionResult = createAction('Parse take action result from compute footprint result.');
const userFootprintUpdated = createAction('Update user footprint parameters.');
const userFootprintReset = createAction('Reset user footprint.');
const updatedFootprintComputed = createAction('Compute updated user footprint.');
const updateTakeactionResult = createAction('Compute and update take action result.');
const updateRemoteUserAnswers = createAction('Update remote user answers through User API.');
const updateActionStatus = createAction('Update status of actions.');
const updateRemoteUserActions = createAction('Update remote user actions through User API.');

export { ensureFootprintComputed, footprintRetrieved, userFootprintError,
  parseFootprintResult, parseTakeactionResult, userFootprintUpdated,
  userFootprintReset, updatedFootprintComputed, updateTakeactionResult,
  updateRemoteUserAnswers, updateActionStatus, updateRemoteUserActions };
