import Ember from 'ember';
import Alert from 'narcissus/utils/alert';

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
        var store = this.container.lookup('store:parse'),
          t = this.container.lookup('utils:t'),
          comment = this.get('content'),
          post = this.get('content.post');

        Alert.warn(t("posts.comment.delete.confirm"), "",
          [t("button.cancel"), t("button.delete")],
          function(i) {
            if (i === 2) {  // ok to destory
              Alert.operating(t("button.deleting"));

              var comments = post.getVal('comments');
              comments.removeObject(comment.get('id'));
              post.setVal('comments', comments);

              store.batch({'destroys': [comment], 'updates': [post]}).then(function(){
              }, function(reason){
                  Alert.warn(reason.error);
                }
              ).then(function(){
                Alert.removeLoading();
              });
            }
          }
        );
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