'use strict';

/* Background video plugin */

(function bgVideo($) {
  'use strict';

  var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || 'ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch);

  var $win = $(window);

  function BgVideo(options) {
    this.options = $.extend(
      {
        containerClass: 'js-background-video',
        loadedClass: 'video-loaded',
        youtubeAPI: '//www.youtube.com/iframe_api',
        width: 640,
        height: 360,
        startSecond: 0.5,
        endSecond: 2.4,
        stopVideo: true
      },
      options
    );
    this.initStructure();
    this.attachEvents();
    this.init();
  }

  BgVideo.prototype = {
    initStructure: function initStructure() {
      this.holder = $(this.options.holder);
      this.isVisible = false;
      this.videoSize = null;
      this.videoContainer = null;
      this.videoData = this.holder.data('background-video');
    },
    getRandomId: function getRandomId() {
      var S4 = function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
    },
    init: function init() {
      if (isTouchDevice) {
        return;
      }
      switch (this.videoData.type) {
        case 'youtube':
          this.initYoutube();
          break;
      }
    },
    initYoutube: function initYoutube() {
      var self = this;
      var container = $('<div />')
        .appendTo(this.holder)
        .addClass(this.options.containerClass);

      var loadPlayer = function loadPlayer() {
        var player = new YT.Player(container[0], {
          height: self.options.height,
          width: self.options.width,
          videoId: self.videoData.video,
          host: 'https://www.youtube.com',
          playerVars: {
            playlist: null,
            autoplay: 1,
            controls: 0,
            enablejsapi: 1,
            origin: 'http://localhost:3000/',
            showinfo: 0,
            modestbranding: 1,
            loop: 1,
            fs: 0,
            cc_load_policy: 0,
            iv_load_policy: 3,
            autohide: 0,
            disablekb: 0,
            rel: 0
          },
          events: {
            onReady: function onReady(e) {
              var interval_is_stopped = false;
              player.mute();
              self.videoContainer = $(player.a);
              self.holder.trigger('loaded.bgVideo');
              e.target.playVideo();

              // This is used to fix video blank on each loop
              self.options.endSecond = e.target.getDuration() - (e.target.getDuration() * 15) / 100;

              setInterval(function() {
                var current_time = e.target.getCurrentTime();

                if (current_time > self.options.endSecond && !interval_is_stopped) {
                  interval_is_stopped = true;
                  if (self.options.stopVideo) {
                    e.target.pauseVideo();
                  } else {
                    jQuery(container[0]).fadeTo(400, 0.7, function() {
                      player.seekTo(0);
                      jQuery(this).fadeTo(400, 1, function() {
                        interval_is_stopped = false;
                      });
                    });
                  }
                }
              }, 10);
            },
            onStateChange: function onStateChange(e) {
              if (e.data) {
                self.holder.addClass('video-playing');
              }
            }
          }
        });
      };
      if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        var youtubeReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function() {
          if (youtubeReady) youtubeReady();
          loadPlayer();
        };
        $.getScript(this.options.youtubeAPI);
      } else {
        loadPlayer();
      }
    },
    resizeVideo: function resizeVideo() {
      var newWidth = this.holder.width() + 1;
      var newHeight = this.holder.width() / this.videoSize.ratio;
      if (newHeight < this.holder.height()) {
        newHeight = this.holder.height();
        newWidth = newHeight * this.videoSize.ratio + 1;
      }
      this.videoContainer.css({
        width: newWidth,
        height: newHeight
      });
    },
    attachEvents: function attachEvents() {
      var self = this;
      this.resizeHandler = function() {
        if (self.videoSize !== null) {
          self.resizeVideo();
        }
      };
      $win.on({
        'load.bgVideo': self.resizeHandler,
        'resize.bgVideo': self.resizeHandler,
        'orientationchange.bgVideo': self.resizeHandler
      });
      this.holder.on('loaded.bgVideo', function() {
        self.videoSize = {
          width: self.videoContainer.width(),
          height: self.videoContainer.height(),
          ratio: self.videoContainer.width() / self.videoContainer.height()
        };
        self.resizeVideo();
        self.holder.addClass(self.options.loadedClass);
      });
      this.resizeHandler();
    },
    destroy: function destroy() {
      $win.off('.bgVideo');
      this.videoContainer.remove();
      this.holder.removeClass(this.options.loadedClass).removeData('BgVideo');
    }
  };
  $.fn.bgVideo = function() {
    return this.each(function() {
      var params = $.extend({}, { holder: $(this) }),
        instance = new BgVideo(params);
      $.data(this, 'BgVideo', instance);
    });
  };

  $('[data-background-video]').bgVideo();
})(jQuery);
