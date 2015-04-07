import Ember from 'ember';
import ModalBodyView from '../modal/modal-body';

export default ModalBodyView.extend({
  title: function() {
    var t = this.container.lookup('utils:t');
    return t('forgot.title');
  }.property(),

  classNames: ["forgot-password-modal"],
  templateName: 'modal/forgot-password',

  didInsertElement: function() {
    this._super();

    var self = this, controller = this.get('controller');
    Ember.run.schedule('afterRender', function() {
      self.$('input').keydown(function(e) {
        if (e.keyCode === 13) {
          if (!controller.get('forgotDisabled')) {
            controller.send('forgotPassword');
          }
        }
      });
    });
  }
});
