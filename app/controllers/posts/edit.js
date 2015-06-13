import Ember from 'ember';

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
    return this.get('editting') ? this.t("button.editting") : this.t("button.edit");
  }.property('editting'),

  editDisabled: function() {
    return this.get('editting') || this.blank('currentUser') ||
      this.blank('model.title') || this.blank('model.body') || this.blank("model.category");
  }.property('editting', 'currentUser', 'model.title', 'model.category', 'model.body'),

  spinnerIcon: function() {
    return this.get('showSpinner') ? 'fa-spinner fa-spin': null;
  }.property('showSpinner'),

  actions: {
    editPost: function() {
      var post = this.get('model'),
        body = post.get('body'),
        self = this;

      this.set('editting', true);
      self.spin(self.t('button.editting'));

      post.setVal('title', post.get('title'));
      post.setVal('body', body);
      post.setVal('category', post.get('category.id'));
      post.setVal('tags', post.get('tags').map(function(tag){ return tag.get('id'); }));

      post.save().then(function(edittedRecord){
        self.transitionToRoute('posts.post', edittedRecord);
      }).catch(function(reason){
        self.am(self.t('ajax.error.operate'), reason.error, 'warn');
      }).finally(function(){
        self.set('editting', false);
        self.closeSpinner();
      });
    },

    cancel: function() {
      var post = this.get('model');
      post.discardChanges();
      this.transitionToRoute('posts.post', post);
    }
  }
});
