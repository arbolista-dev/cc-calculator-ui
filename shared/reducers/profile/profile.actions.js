import { createAction } from 'redux-act';

const retrieveProfile = createAction('Retrieve public user profile from User API.');
const profileRetrieved = createAction('Profile retrieved from API.');
const apiError = createAction('Error retrieving profile from API.');
const setLocation = createAction('Set user location.');
export { retrieveProfile, profileRetrieved, apiError, setLocation };
