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
    if (Ember.isEmpty(this.get('bufferedTitle'))) {
      this.set('bufferedTitle', this.get('title'));
    } else if (this.get('title') !== this.get('bufferedTitle')) {
      var record = this.get('record');

      record.setVal(this.get('bindedName'), this.get('bufferedTitle'));
      record.save().catch(function(errorJson){
        alert(errorJson.error);
      });

      // set title new value
      this.set('title', this.get('bufferedTitle'));
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

    record.destroyRecord().then(function(){
      __this.onDeletedSuccess(__this);
    }).catch(function(errorJson){
      alert(errorJson.error);
    });
  }
});