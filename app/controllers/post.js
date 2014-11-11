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
    }
  }
});