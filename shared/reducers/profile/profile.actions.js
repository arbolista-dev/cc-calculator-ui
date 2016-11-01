import { createAction } from 'redux-act';

const retrieveProfile = createAction('Retrieve public user profile from User API.'),
    profileRetrieved = createAction('Profile retrieved from API.'),
    apiError = createAction('Error retrieving profile from API.');

export { retrieveProfile, profileRetrieved, apiError };
