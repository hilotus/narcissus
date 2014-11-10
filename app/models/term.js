// import Ember from 'ember';
import Model from '../supports/model';

var Term = Model.extend({
});

Term.reopenClass({
  typeKey: 'term',
  schema: {
    'belongTo': {'owner': 'user'},
    'hasMany': {}
  }
});

export default Term;
