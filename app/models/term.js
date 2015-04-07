import Model from 'ember-cli-coreweb/supports/parse-model';

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
