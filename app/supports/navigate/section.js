import Ember from 'ember';

import TitleUpdateRow from './rows/title-update-row';

export default Ember.Object.extend({
  owner: null,

  title: '',

  rows: [],

  commonRows: function() {
    var __this = this;
    return this.get('rows').map(function(row){
      return __this.get(row).create({
        'owner': __this.get('owner'),
        'section': __this
      });
    });
  }.property('rows.length'),

  // for rowCollection generate
  content: [],

  contentRows: function() {
    var __this = this;
    return this.get('content').map(function(record){
      return __this._createContentRow(record, __this);
    });
  }.property('content.length'),

  rowsView: function() {
    var results = [];

    results.pushObjects(this.get('commonRows'));
    results.pushObjects(this.get('contentRows'));

    return results;
  }.property('commonRows.length', 'contentRows.length'),

  /*
  * You can override this method to be dead against your logic specially.
  */
  _createContentRow: function(record, section) {
    return TitleUpdateRow.extend({
      section: section,
      owner: section.get('owner'),

      record: record,

      canDelete: true,

      title: Ember.computed.oneWay('record.name'),

      bufferedTitle: Ember.computed.oneWay('record.name'),

      // which column binded to title
      bindedName: 'name',

      onDeletedSuccess: function(row){
        if (row.get('owner.type') === 'tag') {
          row.get("owner.controller.tags").removeObject(row.get('record'));
        } else {
          row.get("owner.controller.categories").removeObject(row.get('record'));
        }
      },
    }).create();
  }
});