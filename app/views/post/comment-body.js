import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: [':comment-body'],

  body: "",

  template: function() {
    return Ember.Handlebars.compile(marked(this.get('body')));
  }.property('body')
});