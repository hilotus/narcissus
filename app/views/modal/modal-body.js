import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    var self = this;

    // Focus on first element
    Ember.run.schedule('afterRender', function() {
      self.$('input:first').focus();
    });

    $('#alert').hide();

    // 设置modalView的最上面的title
    var title = this.get('title');
    if (title) {
      this.set('controller.controllers.modal/modal.title', title);
    }
  },

  flashMessageChanged: function() {
    var flashMessage = this.get('controller.flashMessage');
    if (flashMessage) {
      var messageClass = flashMessage.get('messageClass') || 'success';
      var $alert = $('#alert').hide().removeClass('alert-error', 'alert-success', 'alert-info');
      $alert.addClass("alert alert-" + messageClass).find('span').text(flashMessage.get('message'));
      $alert.fadeIn();
    }
  }.observes('controller.flashMessage')
});
