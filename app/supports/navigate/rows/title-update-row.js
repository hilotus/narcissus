import Ember from 'ember';
import Row from '../row';

export default Row.extend({
  type: 'title-update',
  record: null,
  title: '',
  // bind to edit input value
  bufferedTitle: '',
  // which column binded to title
  bindedName: 'title',
  isEditing: false,
  canDelete: false,

  cancelEditing: function() {
    this.set('isEditing', false);
    // discard edit input value
    this.set('bufferedTitle', this.get('title'));
  },

  doneEditing: function() {
    // update logic
    var appctrl = this.get('owner.container').lookup('controller:application'),
      bufferedTitle = this.get('bufferedTitle'),
      title = this.get('title');

    if (Ember.isEmpty(bufferedTitle)) {
      this.set('bufferedTitle', title);
    } else if (!Ember.isEqual(title, bufferedTitle)) {
      if (Ember.isNone(this.get('record.id'))) {
        this.set('bufferedTitle', title);
      } else {
        var record = this.get('record'),
          that = this;

        record.setVal(this.get('bindedName'), bufferedTitle);

        appctrl.spin(appctrl.t("button.editting"));
        record.save().catch(function(reason){
          appctrl.am(appctrl.t('ajax.error.operate'), reason.error, 'warn');
        }).finally(function(){
          appctrl.closeSpinner();
          that.set('title', bufferedTitle);
        });
      }
    }
    this.set('isEditing', false);
  },

  edit: function() {
    // reset edit input value
    this.set('bufferedTitle', this.get('title'));
    this.set('isEditing', true);
  },

  onDeletedSuccess: function(){},

  delete: function() {
    if (Ember.isNone(this.get('record.id'))) { return; }

    var appctrl = this.get('owner.container').lookup('controller:application'),
      record = this.get('record');

    var button = {
      label: appctrl.t('button.delete'),
      target: this,
      action: function() {
        appctrl.closeAlertModal();

        var self = this;
        appctrl.spin(appctrl.t("button.deleting"));

        record.delete().then(function(){
          self.onDeletedSuccess(self);
        }).catch(function(reason){
          appctrl.am(appctrl.t('ajax.error.operate'), reason.error, 'warn');
        }).finally(function(){
          appctrl.closeSpinner();
        });
      }
    };
    appctrl.cm(appctrl.t("destroy.prompt"), appctrl.t("destroy.body"), 'warn', button);
  }
});
