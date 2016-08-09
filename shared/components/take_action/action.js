export default class Action {
  constructor(action_key, take_action, category){
    let action = this;
    action.key = action_key;
    action.take_action = take_action;
    action.category = category;
    action.show = false;
    action.detailed = false;
  }

  get api_key(){
    return `input_takeaction_${this.key}`;
  }

  get data(){
    let action = this;
  }

  get display_name(){
    return this.take_action.t(`actions.${this.category}.${this.key}.label`);
  }

  get content(){
    let content = this.take_action.t(`actions.${this.category}.${this.key}.content`, {returnObjects: true})

    this.take_action.selectVehicle(1, this.key);

    // console.log('content', content)
    return content;
  }

  get tons_saved(){
    console.log('-- ', this.key)
    console.log('tons saved', this.take_action.result_takeaction_pounds[this.key])
    return this.take_action.numberWithCommas(
      Math.round(this.take_action.result_takeaction_pounds[this.key] * 100) / 100
    );
  }

  get dollars_saved(){
    return this.take_action.numberWithCommas(
      Math.round(this.take_action.result_takeaction_dollars[this.key]));
  }

  get upfront_cost(){
    return this.take_action.numberWithCommas(
      Math.round(this.take_action.result_takeaction_net10yr[this.key]));
  }

  get taken(){
    return parseInt(this.take_action.userApiValue(this.api_key)) === 1;
  }

}
