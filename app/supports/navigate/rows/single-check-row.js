import Row from '../row';

export default Row.extend({
  type: "single-check",
  // {label: '', value: ''}
  content: null,

  selected: function() {
    return this.get('content.value') === this.get('section.selected');
  }.property('content.label', 'section.selected')
});
