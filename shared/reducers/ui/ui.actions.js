import { createAction } from 'redux-act';

const setUIState = createAction('Set UI state item'),
pushUIAlarm = createAction('Add new UI alarm');

export { setUIState, pushUIAlarm };
