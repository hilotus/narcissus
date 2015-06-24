import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['register-validation'],

  // Object: {failed: true, reason: xxx} or {ok: true, reason: xxx}
  value: null
});
