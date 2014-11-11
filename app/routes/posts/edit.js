import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('post', params.post_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  },

  actions: {
    willTransition: function(/*transition*/) {
      this.set('controller.editing', false);
    }
  }
});