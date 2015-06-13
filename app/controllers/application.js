import Ember from 'ember';
import AlertModal from 'ember-cli-coreweb/mixins/alert-modal';
import SpinModal from 'ember-cli-coreweb/mixins/spin-modal';

export default Ember.Controller.extend(AlertModal, SpinModal, {
  okButtonLabel: function() {
    return this.t('button.ok');
  }.property(),

  cancelButtonLabel: function() {
    return this.t('button.cancel');
  }.property()
});
