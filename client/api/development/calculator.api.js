/*eslint-env browser*/
/*global Promise*/

import superagent from 'superagent';

import xmlToJson from  './../../lib/xml_to_json';

const BASE = 'https://apis.berkeley.edu/coolclimate';
const KEY_ID = '15a335b6';
const KEY = '26ffc87cf832d3d2c6dfb6241a88937a';

class CalculatorApi {

  static computeFootprint(inputs){

    return new Promise((fnResolve, fnReject)=>{
      let params = Object.assign({
        op: 'compute_footprint',
        app_id: KEY_ID,
        app_key: KEY
      }, location);
      superagent.get(`${BASE}/footprint`)
        .set('Content-Type', 'application/xml')
        .set('Accept', 'application/json')
        .query(params)
        .end((err, res)=>{
          if (err) fnReject(err);
          else {
            let xml = new DOMParser().parseFromString(res.text, 'application/xml'),
                parsed = xmlToJson(xml);
            fnResolve(parsed.response);
          }
        });
    });
  }

  // eg: location = {input_location: 06704, input_location_mode: 1, input_income: 1, input_size: 0}
  static getDefaultsAndResults(location){
    let params = Object.assign({
      op: 'get_defaults_and_results',
      app_id: KEY_ID,
      app_key: KEY
    }, location);
    return new Promise((fnResolve, fnReject)=>{
      superagent.get(`${BASE}/footprint-defaults`)
        .set('Content-Type', 'application/xml')
        .query(params)
        .end((err, res)=>{
          if (err) fnReject(err);
          else {
            let xml = new DOMParser().parseFromString(res.text, 'application/xml'),
                parsed = xmlToJson(xml);
            fnResolve(parsed.response);
          }
        });
    });
  }

  // eg: location = {input_location: 06704, input_location_mode: 1}
  static getAutoComplete(location){
    let params = Object.assign({
      op: 'get_auto_complete'
    }, location);
    return new Promise((fnResolve, fnReject)=>{
      superagent.get(BASE)
        .set('Content-Type', 'application/json')
        .query(params)
        .end((err, res)=>{
          if (err) fnReject(err);
          else {
            let xml = new DOMParser().parseFromString(res.text, 'application/xml'),
                parsed = CalculatorApi.xmlToJson(xml);
            fnResolve(parsed.response);
          }
        });
    });
  }

}

export default CalculatorApi;

