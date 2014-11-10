import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function() {
    var controller = this.controllerFor('posts/new');
    controller.set('model', Ember.Object.create({ tags: [] }));

    var __this = this;
    this.store.find('Term', {'where': {'type': 'tag', 'owner': __this.get('currentUser.id')}}).then(function(tags){
      controller.set('bufferedTags', tags);
    }).then(function(){
      __this.store.find('Term', {'where': {'type': 'category', 'owner': __this.get('currentUser.id')}}).then(function(categories){
        controller.set('bufferedCategories', categories);
      }).then(function(){
        __this.render('posts/new');
      });
    });
  },

  renderTemplate: function(){},

  actions: {
    willTransition: function(/*transition*/) {
      this.set('controller.creatingIn', false);
    }
  }
});