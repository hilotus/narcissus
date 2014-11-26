import Ember from 'ember';
import Alert from 'ember-cli-coreweb/utils/alert';

export default Ember.CollectionView.extend({
  classNames: ['comment-list'],
  content: null,

  itemViewClass: Ember.View.extend({
    classNames: ["comment-list-item"],
    templateName: 'post/comment-list-item',

    discardSave: function() {
      this.set('buffered', this.get('content.body'));
      this.set('isEditing', false);
    },

    didSave: function() {
      this.set('isEditing', false);
    },

    isEditing: false,
    isReplying: false,

    actions: {
      edit: function() {
        this.set('buffered', this.get('content.body'));
        this.set('isEditing', true);
        Ember.run.schedule("afterRender", this, function(){
          this.$().find('textarea').focus();
        });
      },

      delete: function() {
        var store = this.container.lookup('store:main'),
          comment = this.get('content'),
          post = this.get('content.post');

        Alert.warn(Ember.I18n.t("post.comment.delete.confirm"), "", [
          Ember.I18n.t("button.cancel"),
          Ember.I18n.t("button.delete")
        ], function(i) {
          if (i === 2) {  // ok to destory
            Alert.operating(Ember.I18n.t("post.comment.deleting"));

            var comments = post.getVal('comments');
            comments.removeObject(comment.get('id'));
            post.setVal('comments', comments);

            store.batch({'destroys': [comment], 'updates': [post]}).then(function(){
            }, function(errorJson){
                Alert.warn(errorJson.error);
              }
            ).then(function(){
              Alert.removeLoading();
            });
          }
        });
      },

      cancel: function() {
        this.discardSave();
      },

      save: function() {
        var comment = this.get('content'),
          __this = this;

        if (!Ember.isEmpty(this.get('buffered').trim()) && comment.get('body') !== this.get('buffered')) {
          comment.setVal('body', this.get('buffered'));
          comment.save().then(function(){
            __this.didSave();
          });
        } else {
          this.discardSave();
        }
      },

      reply: function() {
      }
    }
  })
});