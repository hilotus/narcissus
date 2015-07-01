import Section from './section';
import SingleCheckRow from './rows/single-check-row';

export default Section.extend({
  selected: '',

  onSelect: function(rowValue) {
    this.set('selected', rowValue);
  },

  commonRows: function() {
    var self = this;
    return this.get('rows').map(function(row){
      return SingleCheckRow.extend({
        owner: self.get('owner'),
        section: self,
        content: row
      }).create();
    });
  }.property('rows.length'),
});
