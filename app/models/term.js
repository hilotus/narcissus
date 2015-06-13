var Term = CW.Model.extend({
});

Term.reopenClass({
  typeKey: 'term',
  schema: {
    'belongTo': {'creator': 'user'},
    'hasMany': {}
  }
});

export default Term;
