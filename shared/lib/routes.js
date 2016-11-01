import Food from './routes/food/food';
import Footprint from './routes/footprint/footprint';
import ForgotPassword from './routes/forgot_password/forgot_password';
import GetStarted from './routes/get_started/get_started';
import Home from './routes/home/home';
import Missing from './routes/missing/missing';
import Shopping from './routes/shopping/shopping';
import TakeAction from './routes/take_action/take_action';
import Travel from './routes/travel/travel';
import Settings from './routes/settings/settings';
import Profile from './routes/profile/profile';

export function defineRoutes(i18n) {
  return includeHelpers([
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
    new Settings({
      path: new RegExp(`^\/?((\\w{2})\/)?(${i18n.t('settings.route_path')})$`),
      parameters: {2: 'locale'}
    }),
    new ForgotPassword({
      path: new RegExp(`^\/?((\\w{2})\/)?(${i18n.t('forgot_password.route_path')})$`),
      parameters: {2: 'locale'}
    }),
    new Profile({
      path: new RegExp(`^\/?((\\w{2})\/)?${i18n.t('profile.route_path')}/(\\d+)$`),
      parameters: {2: 'locale', 3: 'user_id'},
      url: function(action, i18n) {
        return `/${i18n.language}/${i18n.t('profile.route_path')}/${action.payload.user_id}`
      }
    }),
    new Missing({
      path: /\.*/,
      parameters: {2: 'locale'}
    })
  ]);
}

export function includeHelpers(routes){
  Object.defineProperty(routes, 'getRoute', {
    value(route_name){
      return this.find(route => route.route_name === route_name)
    },
    enumerable: false,
    configurable: false
  });

  return routes;
}
