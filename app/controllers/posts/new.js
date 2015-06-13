import Ember from 'ember';

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
    return this.get('creating') ? this.t("button.creating") : this.t("button.create");
  }.property('creating'),

  createDisabled: function() {
    return this.get('creating') || this.blank('currentUser') ||
      this.blank('model.title') || this.blank('model.body') || this.blank("model.category");
  }.property('creating', 'currentUser', 'model.title', 'model.category', 'model.body'),

  spinnerIcon: function() {
    return this.get('showSpinner') ? 'fa-spinner fa-spin': null;
  }.property('showSpinner'),

  actions: {
    createPost: function() {
      var model = this.get('model'),
        body = model.get('body'),
        store = this.store,
        self = this;

      this.set('creating', true);
      self.spin(self.t('button.creating'));

      var post = store.__getModelClazz('post').create();
      post.setVal('title', model.get('title'));
      post.setVal('body', body);
      post.setVal('category', model.get('category.id'));
      post.setVal('tags', model.get('tags').map(function(tag){ return tag.get('id'); }));
      post.setVal('creator', this.get("currentUser.id"));
      post.setVal('comments', []);

      post.save().then(function(newRecord) {
        var count = self.get('controllers.posts/index.model.length');
        if (count > 0) {
          self.get('controllers.posts/index.model').insertAt(0, newRecord);
        }
        self.transitionToRoute("posts.index");
      }).catch(function(reason){
        self.am(self.t('ajax.error.operate'), reason.error, 'warn');
      }).finally(function(){
        self.set('creating', true);
        self.closeSpinner();
      });
    },

    cancel: function() {
      this.transitionToRoute('posts.index');
    }
  }
});
