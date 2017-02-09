/* eslint-env browser*/
/* global Promise API_BASE_URL*/

import superagent from 'superagent';

const BASE = API_BASE_URL;

function addUser(input) {
  return new Promise((fnResolve, fnReject) => {
    superagent.post(`${BASE}/user`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function loginUser(input) {
  return new Promise((fnResolve, fnReject) => {
    superagent.post(`${BASE}/user/login`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function loginUserFacebook(input) {
  return new Promise((fnResolve, fnReject) => {
    superagent.post(`${BASE}/user/loginfacebook`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function logoutUser(jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.get(`${BASE}/user/logout`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function updateUser(input, jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.put(`${BASE}/user`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .send(JSON.stringify(input))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function updateAnswers(answers, jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.put(`${BASE}/user/answers`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .send(JSON.stringify({ answers }))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function updateUserGoals(updated_goal, jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.put(`${BASE}/user/goals`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .send(JSON.stringify(updated_goal))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function forgotPassword(input) {
  return new Promise((fnResolve, fnReject) => {
    superagent.post(`${BASE}/user/reset/req`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function setLocation(input, jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.put(`${BASE}/user/location`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .send(JSON.stringify(input))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function setPhoto(photo, jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.post(`${BASE}/user/photo`)
      .set('Authorization', jwt)
      .send(photo)
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function listLeaders(limit, offset, state, household_size) {
  return new Promise((fnResolve, fnReject) => {
    superagent.get(`${BASE}/user/leaders`)
      .query({ limit, offset, state, household_size })
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function listLocations() {
  return new Promise((fnResolve, fnReject) => {
    superagent.get(`${BASE}/user/locations`)
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function showProfile(user_id, jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.get(`${BASE}/user/${user_id}/profile`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function needActivate(jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.get(`${BASE}/user/activate`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function sendConfirmation(jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.post(`${BASE}/user/activate`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function changePassword(input) {
  return new Promise((fnResolve, fnReject) => {
    superagent.post(`${BASE}/user/reset`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res) => {
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

export { addUser,
  loginUser,
  loginUserFacebook,
  logoutUser,
  updateUser,
  updateAnswers,
  forgotPassword,
  setLocation,
  listLeaders,
  listLocations,
  needActivate,
  sendConfirmation,
  changePassword,
  showProfile,
  setPhoto,
  updateUserGoals,
};
