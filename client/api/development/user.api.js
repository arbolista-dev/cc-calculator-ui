/*eslint-env browser*/
/*global Promise*/

import superagent from 'superagent';

const BASE = 'http://localhost:8082/';


class UserApi {

  static addUser(input){
    console.log('addUser inputs: ', JSON.stringify(input))
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

}

export default UserApi;
