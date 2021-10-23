"use strict";

var btnStart = document.querySelector('.asr-btn-start');
var string = document.querySelector('#string');
var play = document.querySelectorAll('.track__play');
var volume = document.querySelectorAll('.track__volume');
var asrBtn = document.querySelector('.asr-btn');
var resultBody = document.querySelector('[data-type="content"]');
var main = document.querySelector('main');

if (asrBtn) {
  asrBtn.addEventListener('click', function (e) {
    var btn = e.target;

    if (btn.classList.contains('asr-btn-start')) {
      btn.classList.remove('asr-btn-start');
      btn.classList.add('asr-btn-loading');
      setTimeout(function () {
        btn.classList.remove('asr-btn-loading');
        btn.classList.add('asr-btn-pause');
        openMain();

        // if (main && main.classList.contains('open')) {
        //   elisa.stop();
        // }
      }, 2500);
    } else if (btn.classList.contains('asr-btn-pause')) {
      btn.classList.remove('asr-btn-pause');
      btn.classList.add('asr-btn-start');
    }
  });
}

if (string) {
  string.addEventListener('change', function () {
    return openMain();
  });
}

if (play) {
  play.forEach(function (i) {
    i.addEventListener('click', function (e) {
      var btn = e.target;
      !btn.classList.contains('pause') ? btn.classList.add('pause') : btn.classList.remove('pause');
    });
  });
}

if (volume) {
  volume.forEach(function (i) {
    i.addEventListener('click', function (e) {
      var btn = e.target;
      var volumeInput = btn.parentNode.querySelector('[data-type=volume_range]');
      var volumeValue = volumeInput.value;

      if (!btn.classList.contains('mute')) {
        btn.classList.add('mute');
        volumeInput.dataset.volume = volumeInput.value;
        volumeInput.value = 0;
      } else {
        btn.classList.remove('mute');
        volumeInput.value = volumeInput.dataset.volume;
      }
    });
  });
}

if (resultBody) {
  resultBody.addEventListener('click', function (e) {
    if (e.target.dataset.type === 'open') {
      var body = e.target.parentNode;
      body.classList.contains('open') ? body.classList.remove('open') : body.classList.add('open');
    }
  });
}

function openMain() {
  var main = document.querySelector('main');

  if (main) {
    !main.classList.contains('open') && main.classList.add('open');
  }
}

lottie.loadAnimation({
  container: document.querySelector('.media__wave'),
  // the dom element that will contain the animation
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'media/wave.json' // the path to the animation json

});
var elisa = lottie.loadAnimation({
  container: document.querySelector('.media__elisa'),
  // the dom element that will contain the animation
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'media/elisa.json' // the path to the animation json

});
var player = document.querySelectorAll('[data-type=player]');

if (player.length !== 0) {
  player.forEach(function (item) {
    var audioPlayer = item.querySelector('[data-id=audio]');
    var audioDuration = item.querySelector('[data-type=duration]');

    if (audioDuration) {
      audioPlayer.onloadedmetadata = function (e) {
        audioDuration.innerHTML = e.target.duration;
      };
    }

    item.addEventListener('click', function (e) {
      var currentBtn = e.target;
      var currentBtnType = currentBtn.dataset.type;
      var roadLn = item.querySelector('[data-type=track]');
      var audioTime = item.querySelector('[data-type=time]');
      var volumeRange = item.querySelector('[data-type=volume_range]');
      var volumeIcon = item.querySelector('[data-type=volume]');
      var road = item.querySelector('[data-type=track_fill]');
      var trackPositionX = e.pageX;

      switch (currentBtnType) {
        case 'btn':
          {
            if (currentBtn.classList.contains('pause')) {
              audioPlayer.play();
            } else {
              audioPlayer.pause();
            }
          }
          break;

        case 'volume':
          {
            currentBtn.classList.contains('mute') ? audioPlayer.muted = true : audioPlayer.muted = false;
          }
          break;

        case 'volume_range':
          {
          }
          break;

        case 'track':
          {
            var trackWidth = currentBtn.getBoundingClientRect().x + currentBtn.getBoundingClientRect().width;
            var trackPercent = 100 - (trackWidth - trackPositionX) / currentBtn.getBoundingClientRect().width * 100;
            var timeToGo = audioPlayer.duration * trackPercent / 100;
            audioPlayer.currentTime = timeToGo;
          }
          break;

        case 'track_fill':
          {
            var _trackWidth = roadLn.getBoundingClientRect().x + roadLn.getBoundingClientRect().width;

            var _trackPercent = 100 - (_trackWidth - trackPositionX) / roadLn.getBoundingClientRect().width * 100;

            var _timeToGo = audioPlayer.duration * _trackPercent / 100;

            audioPlayer.currentTime = _timeToGo;
          }
          break;

        default:
          break;
      }

      if (volumeRange) {
        volumeRange.addEventListener('input', function (e) {
          var volume = e.target.value;
          audioPlayer.volume = volume / 100;

          if (volume == 0) {
            volumeIcon.classList.contains('mute') || volumeIcon.classList.add('mute');
          } else {
            !volumeIcon.classList.contains('mute') || volumeIcon.classList.remove('mute');
          }
        });
      }

      audioPlayer.addEventListener('timeupdate', function (e) {
        var time = e.target.currentTime / e.target.duration * 100;

        if (audioTime) {
          audioTime.innerHTML = e.target.currentTime;
        }

        road.style.width = Math.round(time) + '%';
      });
    });
  });
}

var scrollbox = document.querySelectorAll('[data-type=scrollbox]');

if (scrollbox.length !== 0) {
  scrollbox.forEach(function (item) {
    var track = item.querySelector('[data-type=scrollbox-track]');
    var trackBtn = item.querySelector('[data-type=scrollbox-btn]');
    var trackWidth = track.getBoundingClientRect().width;
    var trackBtnWidth = trackBtn.getBoundingClientRect().width;
    var maxPos = trackWidth - trackBtnWidth - 1;
    var startPos = -1;
    item.addEventListener('click', function (e) {
      var posX = e.pageX;
      var trackPosWidth = track.getBoundingClientRect().x + trackWidth;
      var trackPercent = 100 - (trackPosWidth - posX) / trackWidth * 100;
      var textPos = 24 * trackPercent / 100 - 12;
      var leftPos = 125 * trackPercent / 100 - 1;
      trackBtn.innerHTML = textPos.toFixed(1);
      track.style.boxShadow = "inset ".concat(-150 + Math.floor(leftPos) + 25, "px 0 rgb(255,255,255)");
      trackBtn.style.left = Math.floor(leftPos) + 'px';
    });
    trackBtn.addEventListener('mousedown', function (e) {
      document.addEventListener('mousemove', listener);
    });
    trackBtn.addEventListener('mouseup', function (e) {
      document.removeEventListener('mousemove', listener);
    });
    trackBtn.addEventListener('mouseover', function (e) {
      document.removeEventListener('mousemove', listener);
    });

    var listener = function listener(e) {
      var posX = e.pageX;
      var trackPosWidth = track.getBoundingClientRect().x + trackWidth;
      var trackPercent = 100 - (trackPosWidth - posX) / trackWidth * 100;
      var leftPos = 125 * trackPercent / 100;
      var textPos = 24 * trackPercent / 100 - 12;

      if (posX >= track.getBoundingClientRect().x && posX <= trackPosWidth) {
        trackBtn.style.left = Math.floor(leftPos) + 'px';
        trackBtn.innerHTML = textPos.toFixed(1);
        track.style.boxShadow = "inset ".concat(-150 + Math.floor(leftPos) + 25, "px 0 rgb(255,255,255)");
      }
    };
  });
}

function testWebP(callback) {
  var webP = new Image();

  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };

  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp');
  } else {
    document.querySelector('body').classList.add('no-webp');
  }
});