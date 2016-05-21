import Food from './routes/food/food';
import Footprint from './routes/footprint/footprint';
import GetStarted from './routes/get_started/get_started';
import Home from './routes/home/home';
import Missing from './routes/missing/missing';
import Shopping from './routes/shopping/shopping';
import TakeAction from './routes/take_action/take_action';
import Travel from './routes/travel/travel';

export function defineRoutes(i18n) {
  return [
    new GetStarted({
      path: new RegExp(`^\/?((\\w{2})\/)?(${i18n.t('get_started.route_path')})?$`),
      parameters: {2: 'locale'}
    }),
    new Travel({
      path: new RegExp(`^\/?((\\w{2})\/)?${i18n.t('travel.route_path')}$`),
      parameters: {2: 'locale'}
    }),
    new Home({
      path: new RegExp(`^\/?((\\w{2})\/)?${i18n.t('home.route_path')}$`),
      parameters: {2: 'locale'}
    }),
    new Food({
      path: new RegExp(`^\/?((\\w{2})\/)?${i18n.t('food.route_path')}$`),
      parameters: {2: 'locale'}
    }),
    new Shopping({
      path: new RegExp(`^\/?((\\w{2})\/)?${i18n.t('shopping.route_path')}$`),
      parameters: {2: 'locale'}
    }),
    new Footprint({
      path: new RegExp(`^\/?((\\w{2})\/)?${i18n.t('footprint.route_path')}$`),
      parameters: {2: 'locale'}
    }),
    new TakeAction({
      path: new RegExp(`^\/?((\\w{2})\/)?${i18n.t('take_action.route_path')}$`),
      parameters: {2: 'locale'}
    }),
    new Missing({
      path: new RegExp(`^\/?((\\w{2})\/)?.*$`),
      parameters: {2: 'locale'}
    })
  ]
};