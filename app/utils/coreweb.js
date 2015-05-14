import Ember from 'ember';
import Presence from 'narcissus/mixins/presence';

// parse api
import ParseStore from 'narcissus/supports/parse-store';
import ParseModel from 'narcissus/supports/parse-model';

// injected method
import strings from 'narcissus/supports/extensions/strings';
import array from 'narcissus/supports/extensions/array';
import browser from 'narcissus/supports/extensions/browser';

export default function(container, app) {
  strings();
  array();
  browser();

  // Object
  Ember.Object.reopen(Presence, {});

  // parse store
  app.register('store:parse', ParseStore);
  app.inject('route', 'store', 'store:parse');
  app.inject('controller', 'store', 'store:parse');
  // ParseModel: set store as ParseModel instance's property.
  ParseModel.reopen({'store': container.lookup('store:parse')});
};
