import Ember from 'ember';
import Alert from 'ember-cli-coreweb/utils/alert';

export default Ember.ArrayController.extend({
  isLoaded: false,

  eventTitle: '',
  year: '',
  month: '',
  day: '',
  hour: '',
  minute: '',

  createEvent: function() {
    var store = this.store, _this = this, _event,
      datetime = "%@-%@-%@ %@:%@".fmt(this.get('year'), this.get('month'),
        this.get('day'), this.get('hour'), this.get('minute'));

    datetime = moment(datetime);
    // change to gmt datetime
    datetime = datetime.clone().tz("America/Danmarkshavn").format('YYYY-MM-DD HH:mm');

    _event = store._getModelClazz('event').create();
    _event.setVal('user', this.get('currentUser.id'));
    _event.setVal('description', '');
    _event.setVal('datetime', datetime);
    _event.setVal('title', this.get('eventTitle'));

    Alert.operating(Ember.I18n.t("button.creating"));
    _event.save().then(function(newRecord){
      _this.get('model').pushObject(newRecord);
      _this.setProperties({
        eventTitle: '',
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
      });
    }, function(errorJson){
      Alert.warn(errorJson.error);
    }).then(function(){
      Alert.removeLoading();
    });
  },

  findEvents: function() {
    if (this.get('isLoaded')) {
      return;
    }

    Alert.loading(Ember.I18n.t("loading.title"));

    var _this = this;
    this.store.find('event', {'where': {'user': this.get('currentUser.id')}}).then(
      function(events){
        _this.get('model').pushObjects(events);
        _this.set('isLoaded', true);
      },
      function(errorJson){
        Alert.warn(errorJson.error);
      }
    ).then(function(){
      Alert.removeLoading();
    });
  }
});
