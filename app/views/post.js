import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'post',

  willDestroyElement: function() {
    this._super();

    // TODO: when leave from post page, the post page cannot auto remove.
    this.$().remove();
  }
});