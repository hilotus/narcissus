import Ember from 'ember';
import Alert from '../utils/alert';

export default Ember.ObjectController.extend({
  needs: ['posts/index'],
  actions: {
    edit: function() {
      var post = this.get("model");
      this.transitionToRoute("posts.edit", post);
    },

    delete: function() {
      var controller = this,
        post = this.get("model"),
        comments = post.get('comments');

      Alert.warn(Ember.I18n.t("posts.destroy.prompt"), Ember.I18n.t("posts.destroy.body"),
        [Ember.I18n.t("button.cancel"), Ember.I18n.t("button.delete")], function(i){
        if (i === 2) { // ok
          Alert.operating(Ember.I18n.t("button.deleting"));

          post.destroyRecord().then(function(){
            comments.forEach(function(comment){
              comment.destroyRecord();
            });

            Alert.removeLoading();
          }).then(function(){
            controller.get('controllers.posts/index.model').removeObject(post);
            controller.transitionToRoute('posts.index');
          });
        }
      });
    },

    // create comment for post
    createComment: function(view) {
      var __this = this,
        currentUser = this.get('currentUser'),
        store = this.get('store');

      var comment = store._getModelClazz('comment').create();
      comment.setVals({
        post: this.get("model.id"),
        body: view.get("body"),
        creator_name: view.get('creator_name') || currentUser.get('name'),
        creator_email: view.get('creator_email') || currentUser.get('email'),
        creator_url: view.get('creator_url'),
        creator_ip: view.get('creator_ip'),
        creator: currentUser.get('id'),
      });

      view.set('creating', true);
      Alert.operating(Ember.I18n.t("post.comment.creating"));

      comment.save().then(function(record){
        var post = __this.get('model'),
          comments = post.getVal('comments');

        comments.insertAt(0, record.get('id'));
        post.setVal('comments', comments);

        post.save().then(function(){
          view.set('creating', false);
          view.set("body", "");
          view.set("creator_email", "");
          Alert.removeLoading();
        });
      });
    }
  }
});