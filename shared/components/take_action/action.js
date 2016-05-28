export default class Action {
  constructor(action_key, take_action){
    let action = this;
    action.key = action_key;
    action.take_action = take_action;
  }

  get api_key(){
    return `input_takeaction_${this.key}`;
  }

  get data(){
    let action = this;
  }

  get display_name(){
    return this.take_action.t(`actions.${this.key}.label`);
  }

  get tons_saved(){
    return this.take_action.result_takeaction_pounds[this.key];
  }

  get dollars_saved(){
    return Math.round(this.take_action.result_takeaction_dollars[this.key]);
  }

  get upfront_cost(){
    return Math.round(this.take_action.result_takeaction_net10yr[this.key]);
  }

  get taken(){
    return parseInt(this.take_action.userApiValue(this.api_key)) === 1;
  }

}
