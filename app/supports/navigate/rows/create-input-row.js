import Ember from 'ember';
import Row from '../row';

export default Row.extend({
  type: 'create-input',
  placeholder: '',

  // which field binded
  bindedName: '',

  // which model binded
  bindedModel: '',

  // default value for create record
  defaultValue: {},

  onCreateSuccess: function(){},

  createRecord: function(value) {
    if (Ember.isEmpty(value) || Ember.isEmpty(this.get('bindedName')) || Ember.isEmpty(this.get('bindedModel'))) {
      return;
    }

    var appctrl = this.get('owner.container').lookup('controller:application'),
      store = this.get('store'),
      data = {},
      that = this;

    data[this.get('bindedName')] = value;
    data = Ember.merge(data, this.get('defaultValue'));

    var record = store.__getModelClazz(this.get('bindedModel')).create();
    record.setVals(data);

    appctrl.spin(appctrl.t("button.creating"));
    record.save().then(function(newRecord){
      that.onCreateSuccess(that, newRecord);
    }).catch(function(reason){
      appctrl.am(appctrl.t('ajax.error.operate'), reason.error, 'warn');
    }).finally(function(){
      appctrl.closeSpinner();
    });
  }
});
