import Model from 'ember-cli-coreweb/supports/model';

var Term = Model.extend({
});

Term.reopenClass({
  typeKey: 'term',
  schema: {
    'belongTo': {'creator': 'user'},
    'hasMany': {}
  }
});

export default Term;
