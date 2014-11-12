import Ember from 'ember';
import Validation from '../../utils/validation';

export default Ember.View.extend({
  classNames: ['comment-create'],
  templateName: 'post/comment-create',

  post: null,
  body: "",
  creator_name: "",
  creator_email: "",
  creator_url: "",
  creator_ip: "",

  creating: false,
  createDisabled: function() {
    var currentUser = this.container.lookup('user:current');

    if (!currentUser && !Validation.isEmail(this.get('creator_email'))) {
      return true;
    }
    return this.get('creating') || this.blank('body');
  }.property('body', 'creator_email', 'creating'),

  showSpinner: function() {
    return this.get('creating');
  }.property('creating')
});