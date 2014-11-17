import Ember from 'ember';
import Row from '../row';
import Alert from 'narcissus/utils/alert';

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
    if (Ember.isEmpty(this.get('bufferedTitle'))) {
      this.set('bufferedTitle', this.get('title'));
    } else if (this.get('title') !== this.get('bufferedTitle')) {
      Alert.operating(Ember.I18n.t("button.editting"));

      var record = this.get('record');
      record.setVal(this.get('bindedName'), this.get('bufferedTitle'));
      record.save().catch(function(errorJson){
        Alert.warn(errorJson.error);
      }).then(function(){
        Alert.removeLoading();
      });
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
    var record = this.get('record'),
      __this = this;

    Alert.warn(Ember.I18n.t("destroy.prompt"), Ember.I18n.t("destroy.body"),
      [Ember.I18n.t("button.cancel"), Ember.I18n.t("button.delete")], function(i){
      if (i === 2) { // ok to delete
        Alert.operating(Ember.I18n.t("button.deleting"));
        record.destroyRecord().then(function(){
          __this.onDeletedSuccess(__this);
        }).catch(function(errorJson){
          Alert.warn(errorJson.error);
        }).then(function(){
          Alert.removeLoading();
        });
      }
    });
  }
});