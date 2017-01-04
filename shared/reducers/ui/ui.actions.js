import { createAction } from 'redux-act';

const updateUI = createAction('Set UI state item');
const resetAlerts = createAction('Reset all UI alerts');
const pushAlert = createAction('Add new UI alert');

export { updateUI, resetAlerts, pushAlert };
