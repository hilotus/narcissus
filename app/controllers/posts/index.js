import Ember from 'ember';
import Alert from 'ember-cli-coreweb/utils/alert';

export default Ember.ArrayController.extend({
  model: [],
  // current page
  page: 1,
  // how many record in one page
  perPage: 10,
  isLoadedAll: false,
  isLoading: false,

  keywords: "",
  isSearch: function() {
    return !!this.get("keywords");
  }.property("keywords"),

  filteredPosts: function() {
    var keywords = this.get('keywords').toLocaleLowerCase();
    var posts = this.get('model');

    if (keywords) {
      var filters = posts.filter(function(post){
        var title = post.get('title'),
          cName = post.get('category.name'),
          aName = post.get('creator.name');

        if (title && title.toLocaleLowerCase().indexOf(keywords) > -1) {
          return true;
        } else if (cName && cName.toLocaleLowerCase().indexOf(keywords) > -1) {
          return true;
        } else if (aName && aName.toLocaleLowerCase().indexOf(keywords) > -1) {
          return true;
        } else {
          return false;
        }
      });
      return filters.reverseSortBy("createdAt");
    } else {
      return posts.reverseSortBy("createdAt");
    }
  }.property('keywords', 'model.length'),

  paginate: function(isFirstLoaded) {
    if (this.get("isSearch") || this.get('isLoadedAll')) {
      return undefined;
    }

    var page = this.get('page'),
      perPage = this.get('perPage'),
      __this = this;

    // Loading
    if (isFirstLoaded) {
      this.set('isLoading', true);
    } else {
      Alert.loading(Ember.I18n.t("loading.title"));
    }

    return this.store.find('post', {limit: perPage, skip: (page - 1) * perPage}).then(function(posts){
      var length = posts.get('length');
      if (length > 0) {
        __this.set('page', page + 1);
        __this.get('model').pushObjects(posts);
      }

      if (length === 0) {
        __this.set('isLoadedAll', true);
      }
    }, function(errorJson){
      Alert.warn(errorJson.error);
    }).then(function(){
      if (isFirstLoaded) {
        __this.set('isLoading', false);
      } else {
        Alert.removeLoading();
      }

      return Ember.RSVP.resolve();
    });
  },

  actions: {

  }
});