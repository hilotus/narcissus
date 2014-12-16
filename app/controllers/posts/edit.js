import Ember from 'ember';
import Alert from 'ember-cli-coreweb/utils/alert';

export default Ember.ObjectController.extend({
  needs: ['settings/terms'],

  headerTitleTranslation: 'posts.edit',
  editting: false,

  bufferedTagsBinding: 'controllers.settings/terms.tags',
  bufferedCategoriesBinding: 'controllers.settings/terms.categories',

  showSpinner: function() {
    return this.get('editting');
  }.property('editting'),

  editTitle: function() {
    return this.get('editting') ? Ember.I18n.t("button.editting") : Ember.I18n.t("button.edit");
  }.property('editting'),

  actions: {
    editPost: function() {
      if (!this.get('currentUser')) {
        Alert.warn(Ember.I18n.t("posts.edit.error"), Ember.I18n.t("posts.edit.error.unlogon"));
        return;
      }

      var post = this.get('model'),
        body = post.get('body'),
        __this = this;

      if (!post.get('title') || !post.get('title').trim() || !body || !post.get("category")) {
        Alert.warn(Ember.I18n.t("posts.edit.error"), Ember.I18n.t("posts.edit.error.check.unpass"));
        return;
      }

      this.set('editting', true);
      Alert.operating(Ember.I18n.t("button.editting"));

      post.setVal('title', post.get('title'));
      post.setVal('body', body);
      post.setVal('category', post.get('category.id'));
      post.setVal('tags', post.get('tags').getIds());

      post.save().then(function(){
        __this.transitionToRoute('post', post);
      }, function(errorJson){
        Alert.warn(errorJson.error);
      }).then(function(){
        __this.set('editting', false);
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