/*eslint-env browser*/
/*global Promise*/

import superagent from 'superagent';

const BASE = 'http://localhost:8082/';


class UserApi {

  static addUser(input){
    console.log('addUser input: ', input)
    return new Promise((fnResolve, fnReject)=>{
      superagent.post(BASE + 'user')
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

  static loginUser(input){
    console.log('loginUser input: ', JSON.stringify(input))
    return new Promise((fnResolve, fnReject)=>{
      superagent.post(BASE + 'user/login')
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

  static logoutUser(jwt){
    console.log('user token', jwt);
    return new Promise((fnResolve, fnReject)=>{
      superagent.get(BASE + 'user/logout')
        .set('Content-Type', 'application/json; charset=UTF-8')
        .set('Authorization', jwt)
        .end((err, res)=>{
          if (err) fnReject(err);
          else {
            console.log('res', res.body);
            fnResolve(res.body);
          }
        });
    });
  }

  static updateAnswers(input, jwt){
    console.log('updateAnswers input: ', JSON.stringify(input))
    console.log('user token', jwt);
    return new Promise((fnResolve, fnReject)=>{
      superagent.put(BASE + 'user/answers')
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

}

export default UserApi;
