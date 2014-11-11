import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: [':post-body'],

  body: "",

  template: function() {
    return Ember.Handlebars.compile(marked(this.get('body')));
  }.property('body')
});