import Ember from 'ember';
import Alert from 'narcissus/utils/alert';

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
      return posts.filter(function(post){
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
    } else {
      return posts;
    }
  }.property('keywords', 'model.length'),

  paginate: function(isFirstLoaded) {
    if (this.get("isSearch") || this.get('isLoadedAll')) {
      return undefined;
    }

    var adapter = this.container.lookup('adapter:application'),
      t = this.container.lookup('utils:t'),
      store = this.get('store'),
      page = this.get('page'),
      perPage = this.get('perPage'),
      that = this;

    // Loading
    if (isFirstLoaded) {
      this.set('isLoading', true);
    } else {
      Alert.loading(t("posts.loading"));
    }

    var data = {'order': '-createdAt', 'limit': perPage, 'skip': (page - 1) * perPage};
    return adapter.find('post', data).then(
      function(response) {
        var posts = response.results;
        var length = posts.get('length');
        if (length > 0) {
          that.set('page', page + 1);
          that.get('model').pushObjects(store.push('post', posts));
        }

        if (length === 0) {
          that.set('isLoadedAll', true);
        }
      },
      function(errorJson) {
        Alert.warn(errorJson.error);
      }
    ).then(
      function() {
        if (isFirstLoaded) {
          that.set('isLoading', false);
        } else {
          Alert.removeLoading();
        }

        return Ember.RSVP.resolve();
      }
    );
  }
});
