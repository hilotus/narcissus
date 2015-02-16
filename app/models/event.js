import Model from 'ember-cli-coreweb/supports/model';

var EventModel = Model.extend({
});

EventModel.reopenClass({
  typeKey: 'event',
  schema: {
    'belongTo': {'user': 'user'},
    'hasMany': {}
  }
});

export default EventModel;
