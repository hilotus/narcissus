import Ember from 'ember';
import Alert from '../utils/alert';

export default Ember.ObjectController.extend({
  needs: ['posts/index'],
  actions: {
    edit: function() {
      // var post = this.get("model")
      // PreloadStore.store('selectedPost', post);
      // this.transitionToRoute("posts.edit", post);
    },
    delete: function() {
      var controller = this, post = this.get("model");

      Alert.warn(Ember.I18n.t("posts.destroy.prompt"), Ember.I18n.t("posts.destroy.body"),
        [Ember.I18n.t("button.cancel"), Ember.I18n.t("button.delete")], function(i){
        if (i === 2) { // ok
          // var onSuccess = function() {
          //   controller.get('controllers.posts.model').removeObject(post);
          //   controller.transitionToRoute('posts');
          // };
          // Alert.operating(Ember.I18n.t("button.deleting"));
          // Persistence.deleteRecord(controller.store, 'post', post, onSuccess).then(function(){
          //   Alert.removeLoading();
          // });
        }
      });
    }
  }
});