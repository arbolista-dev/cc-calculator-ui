import c3 from 'c3';

const CATEGORIES = [];

class OveriewChart {

  constructor(user_footprint, average_footprint){
    let overview = this;
    overview.user_footprint = user_footprint;
    overview.average_footprint = average_footprint;
  }

  get categories(){

  }

  get groups(){

  }

  generateData(footprint){
    let overview = this;
    overview.categories.forEach((category)=>{
      let average = overview.average_footprint[api_key],
          user = overview.user_footprint[api_key];
      if (user > average){
        user = user;
        average =
      } else {

      }
    })
  }

  draw(){
    graphs.chart = c3.generate({
      bindto: '#overall_chart',
      data: {
          columns: [
              ['net', -30, 200, 200, 400, -150, 250],
              ['user', 130, 100, -100, 200, -150, 50]
          ],
          type: 'bar',
          groups: [
              ['data1', 'data2']
          ]
      },
      grid: {
          y: {
              lines: [{value:0}]
          }
      }
    });
  }

}
