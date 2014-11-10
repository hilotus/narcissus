import Ember from 'ember';

export default Ember.Mixin.create({
  createdAt: Ember.computed('modelData.createdAt', function(key, value){
    if (arguments.length < 2) {
      return this.get('modelData.createdAt');
    } else {
      if (typeof(value) === 'string') {
        value = new Date(value);
      }
      this.set('modelData.createdAt', value);
      return value;
    }
  }),

  updatedAt: Ember.computed('modelData.updatedAt', function(key, value){
    if (arguments.length < 2) {
      return this.get('modelData.updatedAt');
    } else {
      if (typeof(value) === 'string') {
        value = new Date(value);
      }
      this.set('modelData.updatedAt', value);
      return value;
    }
  }),

  format: "LLL",
  createdAtFormat: function() {
    var user = this.get('container').lookup("user:current"),
      lang = 'zh-cn';

    if (!Ember.empty(user) && !Ember.empty(user.get('locale'))) {
      lang = user.get('locale');
    }

    return moment(this.get("createdAt")).locale(lang).format(this.get("format"));
  }.property('format', 'createdAt'),

  updatedAtFormat: function() {
    var user = this.get('container').lookup("user:current"),
      lang = 'zh-cn';

    if (!Ember.empty(user) && !Ember.empty(user.get('locale'))) {
      lang = user.get('locale');
    }

    return moment(this.get("updatedAt")).locale(lang).format(this.get("format"));
  }.property('format', 'updatedAt')
});