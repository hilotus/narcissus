import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    if (typeof DUOSHUO === 'object') {
      Ember.run.schedule('afterRender', this, function(){
        var el = this.$('div.ds-thread');
        el.empty();
        DUOSHUO.EmbedThread(el);
      });
    }
  }
})
