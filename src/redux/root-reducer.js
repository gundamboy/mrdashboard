import { combineReducers } from 'redux';
import App from '@iso/redux/app/reducer';
import Auth from '@iso/redux/auth/reducer';
import ThemeSwitcher from '@iso/redux/themeSwitcher/reducer';
import Ecommerce from '@iso/redux/ecommerce/reducer';
import LanguageSwitcher from '@iso/redux/languageSwitcher/reducer';
import sponsorshipsReducer from '../redux/sponsorships/reducer';

export default combineReducers({
  Auth,
  App,
  ThemeSwitcher,
  Ecommerce,
  LanguageSwitcher,
  sponsorshipsReducer
});
