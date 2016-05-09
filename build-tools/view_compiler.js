/*global Promise console*/

import ejs from 'ejs';

export default class ViewCompiler {

  static toS(filename, data){
    return new Promise((fnResolve, fnReject)=>{
      ejs.renderFile(filename, data, function(err, result) {
        if (err) {
          console.error('=== ViewCompiler.toS Error ===')
          console.error(err);
          return fnReject(err);
        }
        fnResolve(result);
      });
    });
  }

}
