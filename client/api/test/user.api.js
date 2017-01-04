/* eslint-env browser*/

function addUser() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
      data: {
        name: 'name',
        token: 'token',
        answers: '{}',
      },
    });
  });
}

function loginUser() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
      data: {
        name: 'name',
        token: 'token',
        answers: '{}',
      },
    });
  });
}

function loginUserFacebook() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
      data: {
        name: 'name',
        token: 'token',
        answers: '{}',
      },
    });
  });
}

function logoutUser() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
    });
  });
}

function updateAnswers() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function forgotPassword() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function setLocation() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function listLeaders() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function listLocations() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

export { addUser,
  loginUser,
  loginUserFacebook,
  logoutUser,
  updateAnswers,
  forgotPassword,
  setLocation,
  listLeaders,
  listLocations };
