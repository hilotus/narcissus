import Ember from 'ember';

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
      store = this.get('store'),
      page = this.get('page'),
      perPage = this.get('perPage'),
      self = this;

    // Loading
    if (isFirstLoaded) {
      this.set('isLoading', true);
    } else {
      self.spin(self.t('posts.loading'));
    }

    var data = {'order': '-createdAt', 'limit': perPage, 'skip': (page - 1) * perPage};
    return adapter.find('post', data).then(function(response){
      var posts = response.results;
      var length = posts.get('length');
      if (length > 0) {
        self.set('page', page + 1);
        self.get('model').pushObjects(store.push('post', posts));
      }

      if (length === 0) {
        self.set('isLoadedAll', true);
      }
    }).catch(function(reason){
      self.am(self.t('ajax.error.operate'), reason.error || reason.message, 'warn');
    }).finally(function() {
      if (isFirstLoaded) {
        self.set('isLoading', false);
      } else {
        self.closeSpinner();
      }
      return Ember.RSVP.resolve();
    });
  }
});
