import Ember from 'ember';

export default Ember.View.extend({
  tempalteName: 'application',
  didInsertElement: function() {
    Pace.start({ document: false, /*ajax: false*/ });
  }
});