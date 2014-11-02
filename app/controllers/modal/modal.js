import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    closeAlter: function() {
      $('#alert').hide();
    },
  }
});
