import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    logout: function() {
      localStorage.removeItem("NARCISSUS-USER-TOKEN");
      window.location.reload();
    },

    showLogin: function() {
      this.handleShowLogin();
    },

    showCreateAccount: function() {
      this.handleShowCreateAccount();
    },

    showForgotPassword: function() {
      this.handleShowForgotPassword();
    },

    closeModal: function() {
      this.handleCloseModal();
    },
  },

  handleShowLogin: function() {
    this.__showModal('modal/login');
    this.controllerFor('modal/login').resetForm();
  },

  handleShowCreateAccount: function() {
    this.__showModal('modal/create-account');
    this.controllerFor('modal/create-account').resetForm();
  },

  handleShowForgotPassword: function() {
    this.__showModal('modal/forgot-password');
    this.controllerFor('modal/forgot-password').resetForm();
  },

  handleCloseModal: function() {
    this.__closeModal();
  },

  /*
  * Shows a modal
  * @method showModal
  */
  __showModal: function(name, model) {
    this.controllerFor('modal/modal').set('modalClass', null);
    this.render('modal/modal', {into: 'application', outlet: 'modal'});
    this.render(name, {into: 'modal/modal', outlet: 'modalBody'});
    var controller = this.controllerFor(name);
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

  __closeModal: function() {
    this.disconnectOutlet({ outlet: 'modalBody', parentView: 'modal/modal' });
    this.disconnectOutlet({ outlet: 'modal', parentView: 'application' });
  }
});
