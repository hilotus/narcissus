import strings from '../supports/extensions/strings';
import array from '../supports/extensions/array';
import browser from '../supports/extensions/browser';

export function initialize(/*container, application*/) {
  strings();
  array();
  browser();
}

export default {
  name: 'extension',
  initialize: initialize
};