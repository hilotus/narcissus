import Ember from 'ember';
import Model from '../supports/model';
import Presence from '../mixins/presence';

export var initialize = function(container/*, application*/) {
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