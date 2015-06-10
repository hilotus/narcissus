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

    var data = {},
      store = this.get('store'),
      t = this.get('owner.container').lookup('utils:t'),
      that = this;

    data[this.get('bindedName')] = value;
    data = Ember.merge(data, this.get('defaultValue'));

    var record = store.__getModelClazz(this.get('bindedModel')).create();
    record.setVals(data);

    Alert.operating(t("button.creating"));
    record.save().then(function(newRecord){
      that.onCreateSuccess(that, newRecord);
    }, function(errorJson){
      Alert.warn(errorJson.error);
    }).then(function(){
      Alert.removeLoading();
    });
  }
});
