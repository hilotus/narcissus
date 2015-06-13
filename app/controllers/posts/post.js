import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['posts/index'],

  actions: {
    edit: function() {
      var post = this.get("model");
      this.transitionToRoute("posts.edit", post);
    },

    delete: function() {
      var controller = this,
        post = this.get("model");

      var button = {
        label: this.t('button.delete'),
        target: this,
        action: function() {
          this.closeModal();
          this.spin(this.t('button.deleting'));
          post.delete().then(function(deletedRecord){
            var count = controller.get('controllers.posts/index.model.length');
            if (count > 0) {
              controller.get('controllers.posts/index.model').removeObject(deletedRecord);
            }
            controller.transitionToRoute('posts.index');
          }).catch(function(reason){
            controller.am(controller.t('ajax.error.operate'), reason.error, 'warn');
          }).finally(function(){
            controller.closeSpinner();
          });
        }
      };
      this.cm(this.t("posts.destroy.prompt"), this.t("posts.destroy.body"), 'warn', button);
    }
  }
});
