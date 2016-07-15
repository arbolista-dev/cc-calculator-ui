/*eslint-env browser*/
/*global Promise*/

import superagent from 'superagent';

const BASE = API_BASE_URL;

function addUser(input){
  return new Promise((fnResolve, fnReject)=>{
    superagent.post(BASE + '/user')
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res)=>{
        if (err) fnReject(err);
        else {
          console.log('res', res.body);
          fnResolve(res.body);
        }
      });
  });
}

function loginUser(input){
  return new Promise((fnResolve, fnReject)=>{
    superagent.post(BASE + '/user/login')
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res)=>{
        if (err) fnReject(err);
        else {
          console.log('res', res.body);
          fnResolve(res.body);
        }
      });
  });
}

function logoutUser(jwt){
  return new Promise((fnResolve, fnReject)=>{
    superagent.get(BASE + '/user/logout')
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .end((err, res)=>{
        if (err) fnReject(err);
        else {
          fnResolve(res.body);
        }
      });
  });
}

function updateAnswers(input, jwt){
  return new Promise((fnResolve, fnReject)=>{
    superagent.put(BASE + '/user/answers')
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('Authorization', jwt)
      .send(JSON.stringify({ answers: input }))
      .end((err, res)=>{
        if (err) fnReject(err);
        else {
          console.log('res', res.body);
          fnResolve(res.body);
        }
      });
  });
}

function forgotPassword(input){
  return new Promise((fnResolve, fnReject)=>{
    superagent.post(BASE + '/user/reset/req')
      .set('Content-Type', 'application/json; charset=UTF-8')
      .send(JSON.stringify(input))
      .end((err, res)=>{
        if (err) fnReject(err);
        else {
          console.log('res', res.body);
          fnResolve(res.body);
        }
      });
  });
}

export { addUser, loginUser, logoutUser, updateAnswers, forgotPassword };
