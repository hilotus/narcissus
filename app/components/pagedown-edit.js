import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'pagedown-edit',

  body: '',
  selectedTab: 'edit',

  isEdit: function() {
    return Ember.isEqual(this.get('selectedTab'), 'edit');
  }.property('selectedTab'),

  isPreview: function() {
    return Ember.isEqual(this.get('selectedTab'), 'preview');
  }.property('selectedTab'),

  actions: {
    toggle: function(tab) {
      this.set('selectedTab', tab);
    }
  },

  didInsertElement: function() {
    var converter = new Markdown.Converter();

    converter.hooks.chain("preBlockGamut", function (text, rbg) {
      return text.replace(/^ {0,3}""" *\n((?:.*?\n)+?) {0,3}""" *$/gm, function (whole, inner) {
        return "<blockquote>" + rbg(inner) + "</blockquote>\n";
      });
    });

    converter.hooks.chain("preConversion", function (text) {
      return text.replace(/\b(a\w*)/gi, "*$1*");
    });

    var help = function () { alert("Do you need help?"); };
    var options = {
      helpButton: { handler: help },
      strings: { quoteexample: "whatever you're quoting, put it right here" }
    };

    var editor = new Markdown.Editor(converter, "-narcissus", options);

    editor.run();
  }
});