/*eslint-env browser*/
/*global Promise*/

import {EXAMPLES} from './../../../shared/data/examples';

class ExampleApi {
  static index(){
    return Promise.resolve(EXAMPLES);
  }

}

export default ExampleApi;

