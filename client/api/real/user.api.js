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

function updateAnswers(input, jwt) {
  return new Promise((fnResolve, fnReject) => {
    superagent.put(`${BASE}/user/answers`)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .send(JSON.stringify({ answers: input }))
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

function listLeaders(limit, offset, state, householdSize) {
  return new Promise((fnResolve, fnReject) => {
    superagent.get(`${BASE}/user/leaders`)
      .query({ limit, offset, state, householdSize })
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

export { addUser,
  loginUser,
  loginUserFacebook,
  logoutUser,
  updateAnswers,
  forgotPassword,
  setLocation,
  listLeaders,
  listLocations };
