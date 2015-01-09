import Row from '../row';

export default Row.extend({
  type: 'description-update',
  title: '',
  description: '',
  // bind to edit input value
  bufferedDescription: '',
  isEditing: false,

  cancelEditing: function() {
    this.set('isEditing', false);
    // discard edit input value
    this.set('bufferedDescription', this.get('description'));
  },

  doneEditing: function() {
    // set description new value
    this.set('description', this.get('bufferedDescription'));
    this.set('isEditing', false);
  },

  edit: function() {
    // reset edit input value
    this.set('bufferedDescription', this.get('description'));
    this.set('isEditing', true);
  },
});