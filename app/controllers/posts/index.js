import Ember from 'ember';
import Alert from '../../utils/alert';

export default Ember.ArrayController.extend({
  model: [],
  // current page
  page: 1,
  // how many record in one page
  perPage: 10,
  isLoadedAll: false,

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
          crName = post.get('creator.name');

        if (title && title.toLocaleLowerCase().indexOf(keywords) > -1) {
          return true;
        } else if (cName && cName.toLocaleLowerCase().indexOf(keywords) > -1) {
          return true;
        } else if (crName && crName.toLocaleLowerCase().indexOf(keywords) > -1) {
          return true;
        } else {
          return false;
        }
      }).reverseSortBy("created");
    } else {
      return posts.reverseSortBy("created");
    }
  }.property('keywords', 'model.length'),

  paginate: function(isWithoutAlert) {
    if (this.get("isSearch") || this.get('isLoadedAll')) {
      return undefined;
    }

    var page = this.get('page'),
      perPage = this.get('perPage'),
      __this = this;

    // 加载中
    if (!isWithoutAlert) {
      Alert.loading(Ember.I18n.t("posts.loading"));
    }

    this.store.find('post', {limit: perPage, skip: (page - 1) * perPage}).then(function(posts){
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
      Alert.removeLoading();
    });
  },

  actions: {

  }
});