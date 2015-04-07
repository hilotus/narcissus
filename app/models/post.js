import Model from 'ember-cli-coreweb/supports/parse-model';
import Timestamps from 'narcissus/mixins/timestamps';

var Post = Model.extend(Timestamps, {
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
