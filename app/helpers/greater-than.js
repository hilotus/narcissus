import Ember from "ember";

export default function(param1, param2, options) {
  return Ember.Handlebars.bind.call(options.contexts[0], param1, options, true, function(result) {
    return result > param2;
  });
}