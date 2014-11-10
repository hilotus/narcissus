import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var controller = this.controllerFor('posts/index');
    if (controller.get('model.length') === 0) {
      controller.paginate(true);
    }
    return undefined;
  },

  actions: {
    willTransition: function(/*transition*/) {
      this.set('controller.keywords', '');
    }
  }
});