import Ember from 'ember';

export default Ember.Object.create({
  loading: function(message) {
    var result = '<div class="loading">%@</div>'.fmt(message);
    $("body").append(result);
  },

  removeLoading: function() {
    $("div.loading").remove();
  },

  operating: function(message) {
    var result = '<div class="loading operating"><i class="fa fa-spinner fa-spin"></i>&nbsp;%@</div>'.fmt(message);
    $("body").append(result);
  },

  check: function(title, message, buttons, callback) {
    this._alert("alert-check", title, message, buttons, callback);
  },

  error: function(title, message, buttons, callback) {
    this._alert("alert-error", title, message, buttons, callback);
  },

  warn: function(title, message, buttons, callback) {
    this._alert("alert-warn", title, message, buttons, callback);
  },

  info: function(title, message, buttons, callback) {
    this._alert("alert-info", title, message, buttons, callback);
  },

  _alert: function(type, title, message, buttons, callback) {
    try {
      if (navigator.notification) {
        title = title || "";
        message = message || "";
        if (!callback || typeof(callback) !== "function") {
          callback = function() {};
        }

        if (!buttons || buttons.length === 0) {  // alert
          buttons = Ember.I18n.t("button.ok");
          navigator.notification.alert(message, callback, title, buttons);
        } else {
          if (buttons.length === 1) {
            navigator.notification.alert(message, callback, title, buttons[0]);
          } else {
            navigator.notification.confirm(message, callback, title, buttons);
          }
        }
      } else {
        // 这里设置 tableindex=-1 之后，div才能获得焦点。
        var result = '<div class="modal alert-modal"><div class="outer"><div class="middle"><div class="inner" style="width:380px;">' +
          '<div class="bg-alert %@" tabindex="-1"><h6 class="alert-title">%@</h6><p>%@</p><div class="alert-footer">%@%@</div></div>' +
          '</div></div></div></div>';
        // 不存在，则显示确认按钮
        var ok = '<div class="ios-button small ok"><label class="button-label">%@</label></div>';
        var cancel = '<div class="ios-button small cancel"><label class="button-label">%@</label></div>';

        if (!buttons || buttons.length === 0) {
          result = result.fmt(type, title || "Title", message || "&nbsp;", ok.fmt(Ember.I18n.t("button.ok")), "");
        } else {
          if (buttons.length === 1) {
            result = result.fmt(type, title || "Title", message || "&nbsp;", ok.fmt(buttons[0]), "");
          } else {
            result = result.fmt(type, title || "Title", message || "&nbsp;", cancel.fmt(buttons[0]), ok.fmt(buttons[1]));
          }
        }
        $("body").append(result);
        var remove = function() {
          $("div.alert-modal").remove();
        };

        if (callback && typeof(callback) === "function") {
          $('div.alert-modal').on('click', 'div.ok', function(){ remove(); callback(2);});
          $('div.alert-modal').on('click', 'div.cancel', function(){ remove(); callback(1);});
        } else {
          $('div.alert-modal').on('click', 'div.ok', remove);
          $('div.alert-modal').on('click', 'div.cancel', remove);
        }

        // 点击回车，默认点击ok按钮
        $('div.alert').focus();
        $('div.alert').keydown(function(event){
          if (event.keyCode === 13) { $(this).find('div.ok').click(); }
          if (event.keyCode === 27) { $(this).find('div.cancel').click(); }
        });
      }
    } catch(ex) {}
  },
});