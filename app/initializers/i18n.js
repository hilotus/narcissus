import Ember from 'ember';
import en_us from '../translations/en-us';
import zh_cn from '../translations/zh-cn';

export function initialize(container, application) {
  Ember.ENV.I18N_COMPILE_WITHOUT_HANDLEBARS = true;
  Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN = false;

  application.register('lang:en-us', en_us, { instantiate: false, singleton: true });
  application.register('lang:zh-cn', zh_cn, { instantiate: false, singleton: true });
}

export default {
  name: 'i18n',
  initialize: initialize
};
