import Ember from 'ember';
import Alert from 'narcissus/utils/alert';

export default Ember.Controller.extend({
  needs: ['posts/index', 'settings/terms'],

  headerTitle: function() {
    var t = this.container.lookup('utils:t');
    return t('posts.create.header');
  }.property(),
  creating: false,

  bufferedTagsBinding: 'controllers.settings/terms.tags',
  bufferedCategoriesBinding: 'controllers.settings/terms.categories',

  showSpinner: function() {
    return this.get('creating');
  }.property('creating'),

  createTitle: function() {
    var t = this.container.lookup('utils:t');
    return this.get('creating') ? t("button.creating") : t("button.create");
  }.property('creating'),

  createDisabled: function() {
    return this.get('creating') || this.blank('currentUser') ||
      this.blank('model.title') || this.blank('model.body') || this.blank("model.category");
  }.property('creating', 'currentUser', 'model.title', 'model.category', 'model.body'),

  actions: {
    createPost: function() {
      var model = this.get('model'),
        body = model.get('body'),
        store = this.store,
        t = this.container.lookup('utils:t'),
        that = this;

      this.set('creating', true);
      Alert.operating(t("button.creating"));

      var post = store.__getModelClazz('post').create();
      post.setVal('title', model.get('title'));
      post.setVal('body', body);
      post.setVal('category', model.get('category.id'));
      post.setVal('tags', model.get('tags').getIds());
      post.setVal('creator', this.get("currentUser.id"));
      post.setVal('comments', []);

      post.save().then(function(newRecord){
        that.get('controllers.posts/index.model').insertAt(0, newRecord);
        that.transitionToRoute("posts.index");
      }, function(errorJson){
        Alert.warn(errorJson.error);
      }).then(function(){
        that.set('creating', true);
        Alert.removeLoading();
      });
    },

    cancel: function() {
      this.transitionToRoute('posts.index');
    }
  }
});
