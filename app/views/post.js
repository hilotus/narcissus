import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'post',

  willDestroyElement: function() {
    this._super();

    // TODO: why then post page cannot auto remove.
    this.$().remove();
  }
});