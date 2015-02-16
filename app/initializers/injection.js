import Ember from 'ember';
import injection from 'ember-cli-coreweb/initializers/injection';
import Model from 'ember-cli-coreweb/supports/model';
import Presence from 'ember-cli-coreweb/mixins/presence';

export var initialize = function(container/*, application*/) {
  // Object
  Ember.Object.reopen(Presence, Ember.I18n.TranslateableProperties, {});

  // Route
  Ember.Route.reopenClass({
    /*
    * Shows a modal
    * @method showModal
    */
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
  // add property to Model instance
  Model.reopen({store: store});

  // markd highlight
  injection.initialize();

  // nicescroll
  $("html").niceScroll({'cursorwidth': '6px', 'scrollspeed': 60, 'mousescrollstep': 60});
};

export default {
  name: 'injection',
  after: 'inject-store',
  initialize: initialize
};
