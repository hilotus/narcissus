import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    logout: function() {
      localStorage.removeItem("user-session-token");
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
    Ember.Route.__showModal(this, 'modal/login');
    this.controllerFor('modal/login').resetForm();
  },

  handleShowCreateAccount: function() {
    Ember.Route.__showModal(this, 'modal/create-account');
    this.controllerFor('modal/create-account').resetForm();
  },

  handleShowForgotPassword: function() {
    Ember.Route.__showModal(this, 'modal/forgot-password');
    this.controllerFor('modal/forgot-password').resetForm();
  },

  handleCloseModal: function() {
    Ember.Route.__closeModal(this);
  }
});
