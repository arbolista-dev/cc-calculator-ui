import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';

export default class Vehicle {

  constructor(values, travel, consumption_unit){
    let vehicle = this;
    vehicle.travel = travel;
    vehicle.id = Vehicle.current_id;
    vehicle.consumption_unit = consumption_unit;
    vehicle.params = {
      mpg: {
        tick_values: [10, 25, 40, 55, 70, 85, 100, 115],
        abs_min: 10,
        abs_max: 115
      },
      kml: {
        tick_values: [2, 6, 10, 14, 18, 22, 26, 30],
        abs_min: 2,
        abs_max: 30
      }
    };

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
      tick_values: vehicle.params[vehicle.consumption_unit].tick_values,
      outer_height: 60,
      outer_width: vehicle.travel.slider_width,
      margin: {left: 10, right: 15, top: 0, bottom: 10},
      handle_r: 16,
      onChange: (new_value)=>{
        vehicle.mpg = Math.round(new_value);
        vehicle.travel.updateVehicleFootprint();
      }
    })
    vehicle.slider.drawData({
      abs_min: vehicle.params[vehicle.consumption_unit].abs_min,
      abs_max: vehicle.params[vehicle.consumption_unit].abs_max,
      current_value: vehicle.mpg
    });
  }

  updateConsumptionSlider(){
    let vehicle = this;
    vehicle.slider.redraw({
      tick_values: vehicle.params[vehicle.consumption_unit].tick_values,
      data: {
        abs_min: vehicle.params[vehicle.consumption_unit].abs_min,
        abs_max: vehicle.params[vehicle.consumption_unit].abs_max,
        current_value: vehicle.mpg
      }
    });
  }
}

Vehicle.current_id = 0;
