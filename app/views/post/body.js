import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: [':post-body'],

  body: "",

  template: function() {
    var converter = Markdown.getSanitizingConverter();
    return Ember.Handlebars.compile(converter.makeHtml(this.get('body')));
  }.property('body')
});