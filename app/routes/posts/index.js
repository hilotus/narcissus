import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    if (this.get('controller.model.length') === 0) {
      this.controller.paginate(false);
    }
    return undefined;
  },

  actions: {
    willTransition: function(/*transition*/) {
      this.set('controller.keywords', '');
    }
  }
});