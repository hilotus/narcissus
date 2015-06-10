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
    var bufferedTitle = this.get('bufferedTitle'),
      t = this.get('owner.container').lookup('utils:t'),
      title = this.get('title');

    if (Ember.isEmpty(bufferedTitle)) {
      this.set('bufferedTitle', title);
    } else if (!Ember.isEqual(title, bufferedTitle)) {
      if (Ember.isNone(this.get('record.id'))) {
        this.set('bufferedTitle', title);
      } else {
        Alert.operating(t("button.editting"));

        var record = this.get('record'),
          that = this;

        record.setVal(this.get('bindedName'), bufferedTitle);
        record.save().catch(function(errorJson){
          Alert.warn(errorJson.error);
        }).then(function(){
          Alert.removeLoading();
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
    if (Ember.isNone(this.get('record.id'))) {
      return;
    }

    var record = this.get('record'),
      t = this.get('owner.container').lookup('utils:t'),
      that = this;

    Alert.warn(t("destroy.prompt"),t("destroy.body"),
      [t("button.cancel"), t("button.delete")],
      function(i){
        if (i === 2) { // ok to delete
          Alert.operating(t("button.deleting"));
          record.destroyRecord().then(function(){
            that.onDeletedSuccess(that);
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
