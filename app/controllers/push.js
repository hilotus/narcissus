import Ember from 'ember';
import Alert from 'ember-cli-coreweb/utils/alert';

export default Ember.Controller.extend({
  registerToBaidu: function() {
    if (window.plugins && window.plugins.pushNotification) {
      var pushNotification = window.plugins.pushNotification,
        _this = this;

      pushNotification.register(
        function(result){
          Ember.debug("Push: Registered success:" + JSON.stringify(result));

          var adapter = _this.get('container').lookup("adapter:application"),
            data = {'token': (result.channelId + "_" + result.userId)};

          return adapter.ajax('getToken', "POST", {'data': data}).then(
            function(response){
              return Ember.RSVP.resolve(response);
            },
            function(response){
              return Ember.RSVP.reject(response.responseJSON);
            }
          );
        },
        function(errorJson){
          Alert.error("Push: Registering failed: %@".fmt(JSON.stringify(errorJson)));
        },
        {
          "api_key":"5MdUpTLcx2D6zahWuaWpIlnu",
          "ecb":"window.asdasd",
          "pushTopic": "reminder"
        }
      );
    }
  }
});