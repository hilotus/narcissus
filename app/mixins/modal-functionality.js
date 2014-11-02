import Ember from 'ember';

export default Ember.Mixin.create({
  needs: ['modal/modal'],

  /**
    Flash a message at the top of the modal

    @method blank
    @param {String} name the name of the property we want to check
    @return {Boolean}
  **/
  flash: function(message, messageClass) {
    this.set('flashMessage', Ember.Object.create({
      message: message,
      messageClass: messageClass
    }));
  }
});
