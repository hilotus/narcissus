import Ember from 'ember';
import ModalBodyView from '../modal/modal-body';

export default ModalBodyView.extend({
  title: function() {
    var t = this.container.lookup('utils:t');
    return t('createAccount.title');
  }.property(),

  classNames: ["create-account-modal"],
  templateName: 'modal/create-account',

  didInsertElement: function() {
    this._super();

    // allows the submission the form when pressing 'ENTER' on *any* text input field
    // but only when the submit button is enabled
    var controller = this.get('controller');
    Ember.run.schedule('afterRender', function() {
      $("input[type='text'], input[type='password']").keydown(function(e) {
        if (controller.get('submitDisabled') === false && e.keyCode === 13) {
          controller.send('createAccount');
        }
      });
    });
  }
});
