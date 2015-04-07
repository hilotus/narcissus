import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':markdown-body'],
  body: "",
  cssClass: "",

  didInsertElement: function() {
    this._renderView();
  },

  _renderView: function() {
    var body = this.get('body'),
      css = this.get('cssClass'),
      $self = this.$();

    if (body) {
      $self.empty();
      $self.append(marked(body));
    }
    if (css && !$self.hasClass(css)) {
      $self.addClass(css);
    }
  }.observes('body', 'cssClass')
});
