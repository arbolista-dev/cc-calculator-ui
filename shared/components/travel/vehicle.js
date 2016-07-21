import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';

export default class Vehicle {

  constructor(values, travel){
    let vehicle = this;
    vehicle.travel = travel;
    vehicle.id = Vehicle.current_id;

    Object.assign(vehicle, values || {});
    Vehicle.current_id += 1;
  }

  get slider_id(){
    let vehicle = this;
    return `vehicle_mpg_${vehicle.id}`;
  }

  get display_miles(){
    return Math.round(this.miles);
  }

  get display_mpg(){
    return Math.round(this.mpg);
  }

  cc_inputs(index){
    let vehicle = this;
    return {
      [`input_footprint_transportation_miles${index}`]: vehicle.miles,
      [`input_footprint_transportation_mpg${index}`]: vehicle.mpg,
      [`input_footprint_transportation_fuel${index}`]: vehicle.fuel_type
    };
  }

  initializeMpgSlider(){
    let vehicle = this;
    if (vehicle.slider) return false;
    vehicle.slider = new SimpleSlider({
      container: '#' + vehicle.slider_id,
      tick_values: [0, 20, 40, 60, 80, 100],
      outer_height: 60,
      outer_width: vehicle.travel.slider_width,
      margin: {left: 10, right: 15, top: 0, bottom: 10},
      handle_r: 16,
      onChange: (new_value)=>{
        vehicle.mpg = new_value;
        vehicle.travel.updateVehicleFootprint();
      }
    })
    vehicle.slider.drawData({
      abs_min: 0,
      abs_max: 100,
      current_value: vehicle.mpg
    });
  }

  updateConsumptionSlider(){
    this.slider.setValue(this.mpg, {exec_callback: false});
  }

}

Vehicle.current_id = 0;
