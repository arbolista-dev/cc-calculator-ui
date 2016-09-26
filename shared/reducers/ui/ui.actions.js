import { createAction } from 'redux-act';

const updateUI = createAction('Set UI state item'),
pushAlert = createAction('Add new UI alarm');

export { updateUI, pushAlert };
