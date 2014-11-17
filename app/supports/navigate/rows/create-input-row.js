import Ember from 'ember';
import Row from '../row';
import Alert from 'narcissus/utils/alert';

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
    if (Ember.isEmpty(value)) {
      return;
    }

    var data = {},
      store = this.get('store'),
      __this = this;

    data[this.get('bindedName')] = value;
    data = Ember.merge(data, this.get('defaultValue'));

    var record = store._getModelClazz(this.get('bindedModel')).create();
    record.setVals(data);

    Alert.operating(Ember.I18n.t("button.creating"));
    record.save().then(function(newRecord){
      __this.onCreateSuccess(__this, newRecord);
    }, function(errorJson){
      Alert.warn(errorJson.error);
    }).then(function(){
      Alert.removeLoading();
    });
  }
});