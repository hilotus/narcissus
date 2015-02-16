import Ember from 'ember';
import Model from 'ember-cli-coreweb/supports/model';
import Gravatar from 'ember-cli-coreweb/mixins/gravatar';

var Comment = Model.extend(Gravatar, {
  email: Ember.computed('creator.email', function(){
    if (!Ember.isNone(this.get('creator.email'))) {
      return this.get('creator.email');
    } else {
      return this.get('creator_email');
    }
  }),

  creatorName: function() {
    if (!Ember.isNone(this.get('creator.name'))) {
      return this.get('creator.name');
    } else {
      return this.get('creator_email');
    }
  }.property('creator', 'creator_email'),

  // comment
  isMe: function() {
    var user = this.container.lookup("user:current");
    return user && user.get("id") === this.get('creator.id');
  }.property('creator'),

  // comment is belong to post's creator
  isBelongToAuthor: function() {
    var commentCreatorId = this.get('creator.id'),
      postCreatorId = this.get('post.creator.id');

    return commentCreatorId && postCreatorId && commentCreatorId === postCreatorId;
  }.property('creator', 'post.creator')
});

Comment.reopenClass({
  typeKey: 'comment',
  schema: {
    'belongTo': {'post': 'post', 'creator': 'user'},
    'hasMany': {}
  }
});

export default Comment;
