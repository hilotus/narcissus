import Store from '../supports/store';

export function initialize(container, application) {
  // application.inject('route', 'foo', 'service:foo');
  application.register('store:main', Store);
  application.inject('route', 'store', 'store:main');
  application.inject('controller', 'store', 'store:main');
}

export default {
  name: 'inject-store',
  after: 'i18n',
  initialize: initialize
};
