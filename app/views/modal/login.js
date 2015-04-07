import Ember from 'ember';
import ModalBodyView from '../modal/modal-body';

export default ModalBodyView.extend({
  title: function() {
    var t = this.container.lookup('utils:t');
    return t('login.title');
  }.property(),

  classNames: ["login-modal"],
  templateName: 'modal/login',

  didInsertElement: function() {
    this._super();

    var self = this, loginController = this.get('controller');
    Ember.run.schedule('afterRender', function() {
      self.$('input').keydown(function(e) {
        if (e.keyCode === 13) {
          if (!loginController.get('loginDisabled')) {
            loginController.send('login');
          }
        }
      });
    });
  }
});
