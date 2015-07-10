import Ember from 'ember';

export default Ember.Mixin.create({
  // use duoshuo avatar proxy.
  // url: 'http://gravatar.duoshuo.com/avatar',
  url: 'http://gravatar.com/avatar',

  avatarPhoto: function() {
    return this.get('url') + '/' + md5(this.get('email')) + '?s=48&r=pg&d=identicon';
  }.property('email'),

  avatarPhoto80: function() {
    return this.get('url') + '/' + md5(this.get('email')) + '?s=80&r=pg&d=identicon';
  }.property('email')
});
