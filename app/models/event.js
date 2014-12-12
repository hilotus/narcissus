// import Ember from 'ember';
import Model from '../supports/model';

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
