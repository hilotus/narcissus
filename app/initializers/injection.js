import Ember from 'ember';
import Model from '../supports/model';
import Presence from '../mixins/presence';

export var initialize = function(container/*, application*/) {
  // Enumerable, add reverseSortBy
  Ember.Enumerable.reopen({
    reverseSortBy: function() {
      var sortKeys = arguments;
      return this.toArray().sort(function(a, b){
        for(var i = 0; i < sortKeys.length; i++) {
          var key = sortKeys[i],
          propA = Ember.get(a, key),
          propB = Ember.get(b, key);
          // return 1 or -1 else continue to the next sortKey
          var compareValue = Ember.compare(propB, propA);
          if (compareValue) { return compareValue; }
        }
        return 0;
      });
    }
  });

  // Object
  Ember.Object.reopen(Presence, Ember.I18n.TranslateableProperties, {});

  // Route
  Ember.Route.reopenClass({
    /**
      Shows a modal
      @method showModal
    **/
    __showModal: function(router, name, model) {
      router.controllerFor('modal/modal').set('modalClass', null);
      router.render('modal/modal', {into: 'application', outlet: 'modal'});
      router.render(name, {into: 'modal/modal', outlet: 'modalBody'});
      var controller = router.controllerFor(name);
      if (controller) {
        if (model) {
          controller.set('model', model);
        }
        if(controller && controller.onShow) {
          controller.onShow();
        }
        controller.set('flashMessage', null);
      }
    },

    __closeModal: function(router) {
      router.disconnectOutlet({ outlet: 'modalBody', parentView: 'modal/modal' });
      router.disconnectOutlet({ outlet: 'modal', parentView: 'application' });
    }
  });

  // Model: set store as Model instance's property.
  var store = container.lookup('store:main');
  Model.reopen({store: store});

  // nicescroll
  $("html").niceScroll({ cursorwidth: "6px" });
};

export default {
  name: 'injection',
  after: 'inject-store',
  initialize: initialize
};