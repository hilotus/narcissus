import Model from 'ember-cli-coreweb/supports/model';

var Post = Model.extend({
  // 是否为登录用户创建
  isMe: function() {
    var user = this.container.lookup("user:current");
    return user && user.get("id") === this.get('creator.id');
  }.property('creator')
});

Post.reopenClass({
  typeKey: 'post',
  schema: {
    'belongTo': {'creator': 'user', 'category': 'term'},
    'hasMany': {'tags': 'term', 'comments': 'comment'}
  }
});

export default Post;
