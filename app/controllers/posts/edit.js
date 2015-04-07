import Ember from 'ember';
import Alert from 'narcissus/utils/alert';

export default Ember.Controller.extend({
  needs: ['settings/terms'],

  headerTitle: function() {
    var t = this.container.lookup('utils:t');
    return t('posts.edit.header');
  }.property(),
  editting: false,

  bufferedTagsBinding: 'controllers.settings/terms.tags',
  bufferedCategoriesBinding: 'controllers.settings/terms.categories',

  showSpinner: function() {
    return this.get('editting');
  }.property('editting'),

  editTitle: function() {
    var t = this.container.lookup('utils:t');
    return this.get('editting') ? t("button.editting") : t("button.edit");
  }.property('editting'),

  editDisabled: function() {
    return this.get('editting') || this.blank('currentUser') ||
      this.blank('model.title') || this.blank('model.body') || this.blank("model.category");
  }.property('editting', 'currentUser', 'model.title', 'model.category', 'model.body'),

  actions: {
    editPost: function() {
      var post = this.get('model'),
        body = post.get('body'),
        t = this.container.lookup('utils:t'),
        that = this;

      this.set('editting', true);
      Alert.operating(t("button.editting"));

      post.setVal('title', post.get('title'));
      post.setVal('body', body);
      post.setVal('category', post.get('category.id'));
      post.setVal('tags', post.get('tags').getIds());

      post.save().then(function(){
        that.transitionToRoute('post', post);
      }, function(errorJson){
        Alert.warn(errorJson.error);
      }).then(function(){
        that.set('editting', false);
        Alert.removeLoading();
      });
    },

    cancel: function() {
      var post = this.get('model');
      post.discardChanges();
      this.transitionToRoute('post', post);
    }
  }
});
