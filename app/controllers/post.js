import Ember from 'ember';
import Alert from 'narcissus/utils/alert';

export default Ember.Controller.extend({
  needs: ['posts/index'],
  actions: {
    edit: function() {
      var post = this.get("model");
      this.transitionToRoute("posts.edit", post);
    },

    delete: function() {
      var controller = this,
        t = this.container.lookup('utils:t'),
        store = this.get('store'),
        post = this.get("model"),
        comments = post.get('comments'),
        destroys = [];

      Alert.warn(t("posts.destroy.prompt"), t("posts.destroy.body"),
        [t("button.cancel"), t("button.delete")], function(i){
        if (i === 2) { // ok to delete post
          Alert.operating(t("button.deleting"));

          destroys.pushObjects(comments);
          destroys.pushObject(post);

          store.batch({'destroys': destroys}).then(function(){
            controller.get('controllers.posts/index.model').removeObject(post);
            controller.transitionToRoute('posts.index');
          }).catch(function(reason){
            Alert.warn(reason.error);
          }).finally(function(){
            Alert.removeLoading();
          });
        }
      });
    },

    // create comment for post
    createComment: function(view) {
      var that = this,
        currentUser = this.get('currentUser'),
        t = this.container.lookup('utils:t'),
        store = this.get('store');

      var comment = store.__getModelClazz('comment').create();
      comment.setVals({
        post: this.get("model.id"),
        body: view.get("body"),
        creator_name: view.get('creator_name') || currentUser.get('name'),
        creator_email: view.get('creator_email') || currentUser.get('email'),
        creator_url: view.get('creator_url'),
        creator_ip: view.get('creator_ip'),
        creator: (!!currentUser ? currentUser.get('id') : '')
      });

      view.set('creating', true);
      Alert.operating(t("button.creating"));

      comment.save().then(function(record){
        var post = that.get('model'),
          comments = post.getVal('comments');

        comments.insertAt(0, record.get('id'));
        post.setVal('comments', comments);

        post.save().then(function(){
          view.set('creating', false);
          view.set("body", "");
          view.set("creator_email", "");
          view.set("creator_name", "");
          Alert.removeLoading();
        });
      });
    }
  }
});
