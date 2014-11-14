import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: [':comment-body'],

  body: "",

  renderBody: function() {
    this._renderView(this.get('body'));
  }.observes('body'),

  didInsertElement: function() {
    this._renderView(this.get('body'));
  },

  _renderView: function(body) {
    this.$().empty();
    this.$().append(marked(body));
  }
});