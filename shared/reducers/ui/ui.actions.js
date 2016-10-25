import { createAction } from 'redux-act';

const updateUI = createAction('Set UI state item'),
    resetAlerts = createAction('Reset all UI alerts'),
    pushAlert = createAction('Add new UI alert');

export { updateUI, resetAlerts, pushAlert};
