import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function() {
    var controller = this.controllerFor('posts/new');
    controller.set('model', Ember.Object.create({ tags: [] }));

    var __this = this;
    this.store.find('Term', {'where': {'type': 'tag'}}).then(function(tags){
      controller.set('bufferedTags', tags);
    }).then(function(){
      __this.store.find('Term', {'where': {'type': 'category'}}).then(function(categories){
        controller.set('bufferedCategories', categories);
      }).then(function(){
        __this.render('posts/new');
      });
    });
  },

  renderTemplate: function(){}
});