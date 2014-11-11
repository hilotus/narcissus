// import Ember from 'ember';
import Model from '../supports/model';

var Post = Model.extend({
  // 是否为登录用户创建
  isMe: function() {
    var user = this.container.lookup("user:current");
    return user && user.get("id") === this.get('author.id');
  }.property('author')
});

Post.reopenClass({
  typeKey: 'post',
  schema: {
    'belongTo': {'author': 'user', 'category': 'term'},
    'hasMany': {'tags': 'term', 'comments': 'comment'}
  }
});

export default Post;
