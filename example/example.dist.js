(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _keyframes = _interopRequireDefault(require("../src/keyframes"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var ball = new _keyframes.default(document.getElementById('ball'));
var cbElem = document.getElementById('cb');

function increment() {
  cbElem.innerHTML = parseInt(cbElem.innerHTML, 10) + 1;
}

_keyframes.default.define([{
  name: 'ball-move',
  '0%': {
    'margin-left': '0px'
  },
  '50%': {
    'margin-left': '600px'
  },
  '100%': {
    'margin-left': '0px'
  }
}, {
  name: 'ball-spin',
  from: {
    transform: 'rotate(90deg)'
  },
  to: {
    transform: 'rotate(450deg)'
  }
}]);

window.pause = function () {
  ball.pause();
};

window.resume = function () {
  ball.resume();
};

window.reset = function () {
  ball.reset();
  cbElem.innerHTML = 0;
};

window.play = function (animation) {
  ball.reset(function () {
    switch (animation) {
      case 'normal':
        ball.play({
          name: 'ball-move',
          duration: '3s',
          timingFunction: 'ease',
          iterationCount: 'infinite',
          direction: 'normal',
          fillMode: 'forwards',
          complete: increment
        });
        break;

      case 'spin':
        ball.play('ball-spin 500ms linear 0s 3 normal forwards', increment);
        break;

      case 'linear':
        ball.play({
          name: 'ball-move',
          duration: '3s',
          timingFunction: 'linear',
          iterationCount: 'infinite',
          complete: increment
        });
        break;

      case 'delay':
        ball.play({
          name: 'ball-move',
          duration: '3s',
          timingFunction: 'linear',
          delay: '3s',
          iterationCount: 'infinite',
          complete: increment
        });
        break;

      case 'once':
        ball.play({
          name: 'ball-move',
          duration: '3s',
          timingFunction: 'ease',
          complete: increment
        });
        break;

      case 'multi':
        ball.play(['ball-spin 500ms linear 0s 6', {
          name: 'ball-move',
          duration: '3s',
          timingFunction: 'ease',
          iterationCount: 1
        }], increment);
        break;

      default:
      case 'chained':
        ball.play({
          name: 'ball-spin',
          duration: '1s',
          iterationCount: 1,
          complete: function complete() {
            increment();
            setTimeout(function () {
              return ball.play({
                name: 'ball-move',
                duration: '1s',
                iterationCount: 1,
                complete: function complete() {
                  ball.reset();
                  increment();
                }
              });
            }, 1000);
          }
        });
    }
  });
};

},{"../src/keyframes":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Keyframes =
/*#__PURE__*/
function () {
  function Keyframes(elem) {
    _classCallCheck(this, Keyframes);

    this.elem = elem;
  }

  _createClass(Keyframes, [{
    key: "isSupported",
    value: function isSupported() {
      return document.body.style.animationName !== undefined;
    }
  }, {
    key: "reset",
    value: function reset(callback) {
      this.removeEvents();
      this.elem.style.animationPlayState = 'running';
      this.elem.style.animation = 'none';

      if (callback) {
        requestAnimationFrame(callback);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this.elem.style.animationPlayState = 'paused';
    }
  }, {
    key: "resume",
    value: function resume() {
      this.elem.style.animationPlayState = 'running';
    }
  }, {
    key: "play",
    value: function play(frameOptions, callback) {
      var _this = this;

      if (this.elem.style.animationName === frameOptions.name) {
        this.reset(function () {
          return _this.play(frameOptions, callback);
        });
        return this;
      }

      var animationcss = Keyframes.playCSS(frameOptions);

      var addEvent = function addEvent(type, eventCallback) {
        var listenerName = "".concat(type, "Listener");

        _this.elem.removeEventListener(type, _this[listenerName]);

        _this[listenerName] = eventCallback;

        _this.elem.addEventListener(type, _this[listenerName]);
      };

      this.elem.style.animationPlayState = 'running';
      this.elem.style.animation = animationcss;
      this.frameOptions = frameOptions;
      addEvent('animationiteration', callback || frameOptions.complete);
      addEvent('animationend', callback || frameOptions.complete);
      return this;
    }
  }, {
    key: "removeEvents",
    value: function removeEvents() {
      this.elem.removeEventListener('animationiteration', this.animationiterationListener);
      this.elem.removeEventListener('animationend', this.animationendListener);
    }
  }], [{
    key: "playCSS",
    value: function playCSS(frameOptions) {
      var animObjToStr = function animObjToStr(obj) {
        var newObj = Object.assign({}, {
          duration: '0s',
          timingFunction: 'ease',
          delay: '0s',
          iterationCount: 1,
          direction: 'normal',
          fillMode: 'forwards'
        }, obj);
        return [newObj.name, newObj.duration, newObj.timingFunction, newObj.delay, newObj.iterationCount, newObj.direction, newObj.fillMode].join(' ');
      };

      if (frameOptions.constructor === Array) {
        var frameOptionsStrings = [];

        for (var i = 0; i < frameOptions.length; i += 1) {
          frameOptionsStrings.push(typeof frameOptions[i] === 'string' ? frameOptions[i] : animObjToStr(frameOptions[i]));
        }

        return frameOptionsStrings.join(', ');
      }

      if (typeof frameOptions === 'string') {
        return frameOptions;
      }

      return animObjToStr(frameOptions);
    }
  }, {
    key: "generateCSS",
    value: function generateCSS(frameData) {
      var css = "@keyframes ".concat(frameData.name, " {");

      for (var key in frameData) {
        if (key !== 'name' && key !== 'media' && key !== 'complete') {
          css += "".concat(key, " {");

          for (var property in frameData[key]) {
            css += "".concat(property, ":").concat(frameData[key][property], ";");
          }

          css += '}';
        }
      }

      css += '}';

      if (frameData.media) {
        css = "@media ".concat(frameData.media, "{").concat(css, "}");
      }

      return css;
    }
  }, {
    key: "generate",
    value: function generate(frameData) {
      var css = this.generateCSS(frameData);
      var oldFrameIndex = Keyframes.rules.indexOf(frameData.name);

      if (oldFrameIndex > -1) {
        Keyframes.sheet.deleteRule(oldFrameIndex);
        delete Keyframes.rules[oldFrameIndex];
      }

      var ruleIndex = Keyframes.sheet.insertRule(css, 0);
      Keyframes.rules[ruleIndex] = frameData.name;
    }
  }, {
    key: "define",
    value: function define(frameData) {
      if (frameData.length) {
        for (var i = 0; i < frameData.length; i += 1) {
          this.generate(frameData[i]);
        }
      } else {
        this.generate(frameData);
      }
    }
  }, {
    key: "defineCSS",
    value: function defineCSS(frameData) {
      if (frameData.length) {
        var css = '';

        for (var i = 0; i < frameData.length; i += 1) {
          css += this.generateCSS(frameData[i]);
        }

        return css;
      }

      return this.generateCSS(frameData);
    }
  }, {
    key: "plugin",
    value: function plugin(pluginFunc) {
      if (pluginFunc.constructor === Array) {
        for (var i = 0; i < pluginFunc.length; i += 1) {
          pluginFunc[i](Keyframes);
        }
      } else {
        pluginFunc(Keyframes);
      }
    }
  }]);

  return Keyframes;
}();

if (typeof document !== 'undefined') {
  var style = document.createElement('style');
  style.setAttribute('id', 'keyframesjs-stylesheet');
  document.head.appendChild(style);
  Keyframes.sheet = style.sheet;
  Keyframes.rules = [];
}

var _default = Keyframes;
exports.default = _default;

},{}]},{},[1]);
