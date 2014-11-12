import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'a',
  classNames: ['post-tag'],
  tag: null,
  template: Ember.Handlebars.compile("{{view.tag.name}}"),

  click: function() {
  }
});