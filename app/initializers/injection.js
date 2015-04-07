import Ember from 'ember';
import corewebInit from 'ember-cli-coreweb/utils/coreweb';

export var initialize = function(container, app) {
  // Coreweb initialize
  corewebInit(container, app);

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

  // nicescroll
  $("html").niceScroll({'cursorwidth': '6px', 'scrollspeed': 60, 'mousescrollstep': 60});
};

export default {
  name: 'injection',
  initialize: initialize
};
