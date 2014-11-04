import Ember from 'ember';
import Model from '../supports/model';

var Post = Model.extend({
  category: Ember.computed('modelData.category', function(key, value){
    if (arguments.length < 2) {
      return this.get('store').find('term', this.get('modelData.category'));
    } else {
      this.set('modelData.category', value);
      return value;
    }
  }),

  tags: Ember.computed('modelData.tags', function(key, value){
    if (arguments.length < 2) {
      return this.get('store').find('term', {'where': {'objectId': {'$in': this.get('modelData.tags')}}});
    } else {
      if (!Ember.isArray(value)) {
        throw new Error("tags column's value must be array.");
      }
      this.set('modelData.tags', value);
      return value;
    }
  }),

  /*
  * user
  */
  creator: Ember.computed('modelData.creator', function(key, value){
    if (arguments.length < 2) {
      return this.get('store').find('user', this.get('modelData.creator'));
    } else {
      this.set('modelData.creator', value);
      return value;
    }
  }),

  // 是否为登录用户创建
  isMe: function() {
    var user = this.container.lookup("user:current");
    return user && user.get("id") === this.get('creator.id');
  }.property('creator')
});

Post.reopenClass({
  typeKey: 'post',
});

export default Post;
