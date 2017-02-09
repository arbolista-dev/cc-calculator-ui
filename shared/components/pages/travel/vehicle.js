import SimpleSlider from 'd3-object-charts/src/slider/simple_slider';

export default class Vehicle {

  constructor(values, travel, consumption_unit) {
    const vehicle = this;
    vehicle.travel = travel;
    vehicle.id = Vehicle.current_id;
    vehicle.consumption_unit = consumption_unit;
    vehicle.params = {
      mpg: {
        tick_values: [10, 25, 40, 55, 70, 85, 100, 115],
        abs_min: 10,
        abs_max: 115,
        avg: 22,
      },
      kml: {
        tick_values: [2, 6, 10, 14, 18, 22, 26, 30],
        abs_min: 2,
        abs_max: 30,
        avg: 7,
      },
      electric: {
        tick_values: [40, 55, 70, 85, 100, 115, 130, 145],
        abs_min: 40,
        abs_max: 145,
        avg: 115,
      },
    };
    Object.assign(vehicle, values || {});
    Vehicle.current_id += 1;
  }

  get slider_id() {
    const vehicle = this;
    return `vehicle_mpg_${vehicle.id}`;
  }

  get display_miles() {
    return Math.round(this.miles);
  }

  get display_mpg() {
    return Math.round(this.mpg);
  }

  get slider_extent() {
    return this.electric ? 'electric' : this.consumption_unit;
  }

  cc_inputs(index) {
    const vehicle = this;
    return {
      [`input_footprint_transportation_miles${index}`]: vehicle.miles,
      [`input_footprint_transportation_mpg${index}`]: vehicle.mpg,
      [`input_footprint_transportation_fuel${index}`]: vehicle.fuel_type,
      [`input_footprint_transportation_electric${index}`]: vehicle.electric,
    };
  }

  initializeMpgSlider() {
    const vehicle = this;
    if (vehicle.slider) return;
    vehicle.slider = new SimpleSlider({
      container: `#${vehicle.slider_id}`,
      tick_values: vehicle.params[this.slider_extent].tick_values,
      outer_width: vehicle.travel.slider_width,
      handle_r: 16,
      axis_click_handle: true,
      onChange: (new_value) => {
        vehicle.mpg = Math.round(new_value);
        vehicle.travel.updateVehicleFootprint();
      },
    });
    vehicle.slider.drawData({
      abs_min: vehicle.params[this.slider_extent].abs_min,
      abs_max: vehicle.params[this.slider_extent].abs_max,
      current_value: vehicle.mpg,
    });
  }

  updateConsumptionSlider() {
    const vehicle = this;
    vehicle.slider.redraw({
      tick_values: vehicle.params[this.slider_extent].tick_values,
      data: {
        abs_min: vehicle.params[this.slider_extent].abs_min,
        abs_max: vehicle.params[this.slider_extent].abs_max,
        current_value: vehicle.mpg,
      },
    });
  }
}

Vehicle.current_id = 0;
