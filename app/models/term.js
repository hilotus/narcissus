// import Ember from 'ember';
import Model from '../supports/model';

var Term = Model.extend({
});

Term.reopenClass({
  typeKey: 'term',
  schema: {
    // 'belongTo': {'owner': 'user'},
    'belongTo': {},
    'hasMany': {}
  }
});

export default Term;
