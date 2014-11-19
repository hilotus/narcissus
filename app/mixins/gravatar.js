import Ember from 'ember';

export default Ember.Mixin.create({
  /*
  * Gravatar头像管理
  * 官方文档：http://en.gravatar.com/site/implement/
  * s=25, (返回头像的宽高)
  * d=identicon，返回一个基于email_md5的生成的默认头像
  * r=pg, (上传头像时，会让您选择一个限制级别，越向右限制级别越高: g -> pg -> r -> x)
  *
  * replace www.gravatar.com to gravatar.duoshuo.com
  */
  gravatar: "http://gravatar.duoshuo.com/avatar/%@?s=%@&r=pg&d=identicon",

  avatarPhoto: function() {
    var email_md5 = md5(this.get("email"));
    return this.get("gravatar").fmt(email_md5, 48);
  }.property('email'),

  avatarPhoto80: function() {
    var email_md5 = md5(this.get("email"));
    return this.get("gravatar").fmt(email_md5, 80);
  }.property('email'),
});