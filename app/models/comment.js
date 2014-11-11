// import Ember from 'ember';
import Model from '../supports/model';

var Comment = Model.extend({
  // comment
  isMe: function() {
    var user = this.container.lookup("user:current");
    return user && user.get("id") === this.get('creator.id');
  }.property('creator'),

  // comment is belong to post's author
  isBelongToAuthor: function() {
    var commentCreatorId = this.get('creator.id'),
      postCreatorId = this.get('post.author.id');

    return commentCreatorId && postCreatorId && commentCreatorId === postCreatorId;
  }.property('creator', 'post.author')
});

Comment.reopenClass({
  typeKey: 'comment',
  schema: {
    'belongTo': {'post': 'post', 'creator': 'user'},
    'hasMany': {}
  }
});

export default Comment;