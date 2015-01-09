import Ember from 'ember';
import Row from '../row';
import Alert from 'ember-cli-coreweb/utils/alert';

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
    var bufferedTitle = this.get('bufferedTitle'),
      title = this.get('title');

    if (Ember.isEmpty(bufferedTitle)) {
      this.set('bufferedTitle', title);
    } else if (!Ember.isEqual(title, bufferedTitle)) {
      if (Ember.isNone(this.get('record.id'))) {
        this.set('bufferedTitle', title);
      } else {
        Alert.operating(Ember.I18n.t("button.editting"));

        var record = this.get('record'), _this = this;
        record.setVal(this.get('bindedName'), bufferedTitle);
        record.save().catch(function(errorJson){
          Alert.warn(errorJson.error);
        }).then(function(){
          Alert.removeLoading();
          _this.set('title', bufferedTitle);
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
    if (Ember.isNone(this.get('record.id'))) {
      return;
    }

    var record = this.get('record'),
    _this = this;

    Alert.warn(
      Ember.I18n.t("destroy.prompt"),
      Ember.I18n.t("destroy.body"),
      [Ember.I18n.t("button.cancel"), Ember.I18n.t("button.delete")],
      function(i){
        if (i === 2) { // ok to delete
          Alert.operating(Ember.I18n.t("button.deleting"));
          record.destroyRecord().then(function(){
            _this.onDeletedSuccess(_this);
          }).catch(function(errorJson){
            Alert.warn(errorJson.error);
          }).then(function(){
            Alert.removeLoading();
          });
        }
      }
    );
  }
});