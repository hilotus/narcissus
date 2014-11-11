import Ember from 'ember';
import Validation from '../../utils/validation';
import Alert from '../../utils/alert';

export default Ember.View.extend({
  classNames: ['comment-create'],
  templateName: 'post/comment-create',

  post: null,
  body: "",
  creator_name: "",
  creator_email: "",
  creator_url: "",
  creator_ip: "",

  creatingIn: false,
  createDisabled: function() {
    var currentUser = this.container.lookup('user:current');

    if (!currentUser && !Validation.isEmail(this.get('creator_email'))) {
      return true;
    }
    return this.get('creatingIn') || this.blank('body');
  }.property('body', 'creator_email', 'creatingIn'),

  showSpinner: function() {
    return this.get('creatingIn');
  }.property('creatingIn'),

  actions: {
    createComment: function() {
      var __this = this,
        currentUser = this.container.lookup('user:current'),
        store = this.container.lookup('store:main');

      var comment = store._getModelClazz('comment').create();
      comment.setVals({
        post: this.get("post.id"),
        body: this.get("body"),
        creator_name: this.get('creator_name') || currentUser.get('name'),
        creator_email: this.get('creator_email') || currentUser.get('email'),
        creator_url: this.get('creator_url'),
        creator_ip: this.get('creator_ip'),
        creator: currentUser.get('id'),
      });

      this.set('creatingIn', true);
      Alert.operating(Ember.I18n.t("post.comment.creating"));

      comment.save().then(function(record){
        var post = __this.get('post'),
          comments = post.getVal('comments');

        comments.insertAt(0, record.get('id'));
        post.setVal('comments', comments);

        post.save().then(function(){
          __this.set('creatingIn', false);
          __this.set("body", "");
          __this.set("creator_email", "");
          Alert.removeLoading();
        });
      });
    }
  }
});