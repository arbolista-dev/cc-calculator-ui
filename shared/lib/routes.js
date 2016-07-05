import Food from './routes/food/food';
import Footprint from './routes/footprint/footprint';
import ForgotPassword from './routes/forgot_password/forgot_password';
import GetStarted from './routes/get_started/get_started';
import Home from './routes/home/home';
import Login from './routes/login/login';
import Missing from './routes/missing/missing';
import Shopping from './routes/shopping/shopping';
import SignUp from './routes/sign_up/sign_up';
import TakeAction from './routes/take_action/take_action';
import Travel from './routes/travel/travel';

export function defineRoutes(i18n) {
  return [
    new SignUp({
      path: new RegExp(`^\/?((\\w{2})\/)?(${i18n.t('sign_up.route_path')})?$`),
      parameters: {2: 'locale'}
    }),
    new Login({
      path: new RegExp(`^\/?((\\w{2})\/)?(${i18n.t('login.route_path')})?$`),
      parameters: {2: 'locale'}
    }),
    new ForgotPassword({
      path: new RegExp(`^\/?((\\w{2})\/)?(${i18n.t('forgot_password.route_path')})?$`),
      parameters: {2: 'locale'}
    }),
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
