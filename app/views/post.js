import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'post',

  willDestroyElement: function() {
    this._super();

    // TODO: when transit from post page, the page cannot auto remove.
    this.$().remove();
  }
});