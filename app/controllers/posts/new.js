import Ember from 'ember';
import Alert from '../../utils/alert';

export default Ember.ObjectController.extend({
  needs: ['posts/index'],

  headerTitleTranslation: 'posts.create',
  creating: false,

  showSpinner: function() {
    return this.get('creating');
  }.property('creating'),

  createTitle: function() {
    return this.get('creating') ? Ember.I18n.t("button.creating") : Ember.I18n.t("button.create");
  }.property('creating'),

  actions: {
    createPost: function() {
      if (!this.get('currentUser')) {
        Alert.warn(Ember.I18n.t("posts.create.error"), Ember.I18n.t("posts.create.error.unlogon"));
        return;
      }

      var model = this.get('model'),
        body = model.get('body'),
        store = this.store,
        __this = this;

      if (!model.get('title') || !model.get('title').trim() || !body || !model.get("category")) {
        Alert.warn(Ember.I18n.t("posts.create.error"), Ember.I18n.t("posts.create.error.check.unpass"));
        return;
      }

      this.set('creating', true);
      Alert.operating(Ember.I18n.t("button.creating"));
      var __post = store._getModelClazz('post').create();
      __post.setVal('title', model.get('title'));
      __post.setVal('body', body);
      __post.setVal('category', model.get('category.id'));
      __post.setVal('tags', model.get('tags').getIds());
      __post.setVal('author', this.get("currentUser.id"));
      __post.setVal('comments', []);

      __post.save().then(function(newRecord){
        __this.get('controllers.posts/index.model').insertAt(0, newRecord);
        __this.transitionToRoute("posts.index");
      }, function(errorJson){
        Alert.warn(errorJson.error);
      }).then(function(){
        __this.set('creating', true);
        Alert.removeLoading();
      });
    },

    cancel: function() {
      this.transitionToRoute('posts.index');
    }
  }
});