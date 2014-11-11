import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function() {
    var controller = this.controllerFor('posts/new');
    controller.set('model', Ember.Object.create({tags: []}));
  },

  actions: {
    willTransition: function(/*transition*/) {
      this.set('controller.creating', false);
    }
  }
});