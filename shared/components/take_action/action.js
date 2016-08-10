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

    if (this.category === 'transportation') this.take_action.selectVehicle(1, this.key);
    if (this.key === 'practice_eco_driving' || this.key === 'maintain_my_vehicles') this.take_action.calcVehicleTotal(this.key);
    if (this.key === 'reduce_air_travel') this.take_action.getAirTotal();

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
