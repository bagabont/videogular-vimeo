'use strict';

angular.module('videogular.plugins.vimeo', [])
  .directive('vgVimeo', ['VG_STATES', function (VG_STATES) {
      return {
        restrict: 'A',
        require: '^videogular',
        link: function (scope, elem, attr, API) {
          var player, videoWidth, videoHeight, currentTime, duration, paused, volume;

          function getVideoId(url) {
            var vimeoUrlRegExp = /^.+vimeo.com\/(.*\/)?([^#\?]*)/;
            var m = url.match(vimeoUrlRegExp);
            return m ? m[2] || m[1] : null;
          }

          function updateMetadata() {
            var event = new CustomEvent('loadedmetadata');
            API.mediaElement[0].dispatchEvent(event);
          }

          function configurePlayer() {
            Object.defineProperties(API.mediaElement[0], {
                'currentTime': {
                  get: function () {
                    return currentTime;
                  },
                  set: function (value) {
                    currentTime = value;
                    player.vimeo('seekTo', value);
                  }
                },
                'duration': {
                  get: function () {
                    return duration;
                  }
                },
                'paused': {
                  get: function () {
                    return paused;
                  }
                },
                'videoWidth': {
                  get: function () {
                    return videoWidth;
                  }
                },
                'videoHeight': {
                  get: function () {
                    return videoHeight;
                  }
                },
                'volume': {
                  get: function () {
                    return volume;
                  },
                  set: function (value) {
                    volume = value;
                    player.vimeo('setVolume', value);
                  }
                }
              }
            );
            API.mediaElement[0].play = function () {
              player.vimeo('play');
            };
            API.mediaElement[0].pause = function () {
              player.vimeo('pause');
            };

            player
              .vimeo('getVolume', function (value) {
                volume = value;
                API.onVolumeChange();
              })
              .vimeo('getCurrentTime', function (value) {
                currentTime = value;
                updateMetadata();
              })
              .vimeo('getDuration', function (value) {
                duration = value;
                updateMetadata();
              })
          }

          function createVimeoIframe(id) {
            return $('<iframe>', {
              src: '//player.vimeo.com/video/' + id + '?api=1&player_id=vimeoplayer',
              frameborder: 0,
              scrolling: 'no'
            }).css({
              'width': '100%',
              'height': 'calc(100% + 400px)',
              'margin-top': '-200px'
            });
          }

          function wirePlayer() {
            player
              .on('ready', function () {
                configurePlayer();
              })
              .on('play', function () {
                paused = false;
                var event = new CustomEvent('playing');
                API.mediaElement[0].dispatchEvent(event);
                API.setState(VG_STATES.PLAY);
              })
              .on('pause', function () {
                paused = true;
                var event = new CustomEvent('pause');
                API.mediaElement[0].dispatchEvent(event);
                API.setState(VG_STATES.PAUSE);
              })
              .on('finish', function () {
                API.onComplete();
              })
              .on('playProgress', function (event, data) {
                currentTime = data.seconds;
                duration = data.duration;
                API.onUpdateTime({
                  target: API.mediaElement[0]
                });
              });
          }

          function onSourceChange(url) {
            if (!url) {
              if (player) {
                player.destroy();
              }
              return
            }
            var id = getVideoId(url);
            if (!id) {
              return;
            }
            player = createVimeoIframe(id);
            // Swap video element with Vimeo iFrame
            $(API.mediaElement[0]).replaceWith(player);
            wirePlayer(player);
          }

          scope.$watch(function () {
              return API.sources;
            },
            function (newVal, oldVal) {
              if (newVal && newVal.length > 0 && newVal[0].src) {
                onSourceChange(newVal[0].src.toString());
              }
              else {
                onSourceChange(null);
              }
            }
          );
        }
      };
    }]
  );