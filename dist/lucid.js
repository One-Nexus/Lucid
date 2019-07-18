module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2018 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



function isSpecificValue(val) {
	return (
		val instanceof Buffer
		|| val instanceof Date
		|| val instanceof RegExp
	) ? true : false;
}

function cloneSpecificValue(val) {
	if (val instanceof Buffer) {
		var x = Buffer.alloc
			? Buffer.alloc(val.length)
			: new Buffer(val.length);
		val.copy(x);
		return x;
	} else if (val instanceof Date) {
		return new Date(val.getTime());
	} else if (val instanceof RegExp) {
		return new RegExp(val);
	} else {
		throw new Error('Unexpected situation');
	}
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
	var clone = [];
	arr.forEach(function (item, index) {
		if (typeof item === 'object' && item !== null) {
			if (Array.isArray(item)) {
				clone[index] = deepCloneArray(item);
			} else if (isSpecificValue(item)) {
				clone[index] = cloneSpecificValue(item);
			} else {
				clone[index] = deepExtend({}, item);
			}
		} else {
			clone[index] = item;
		}
	});
	return clone;
}

function safeGetProperty(object, property) {
	return property === '__proto__' ? undefined : object[property];
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = module.exports = function (/*obj_1, [obj_2], [obj_N]*/) {
	if (arguments.length < 1 || typeof arguments[0] !== 'object') {
		return false;
	}

	if (arguments.length < 2) {
		return arguments[0];
	}

	var target = arguments[0];

	// convert arguments to array and cut off target object
	var args = Array.prototype.slice.call(arguments, 1);

	var val, src, clone;

	args.forEach(function (obj) {
		// skip argument if isn't an object, is null, or is an array
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			return;
		}

		Object.keys(obj).forEach(function (key) {
			src = safeGetProperty(target, key); // source value
			val = safeGetProperty(obj, key); // new value

			// recursion prevention
			if (val === target) {
				return;

			/**
			 * if new value isn't object then just overwrite by new value
			 * instead of extending.
			 */
			} else if (typeof val !== 'object' || val === null) {
				target[key] = val;
				return;

			// just clone arrays (and recursive clone objects inside)
			} else if (Array.isArray(val)) {
				target[key] = deepCloneArray(val);
				return;

			// custom cloning and overwrite for specific objects
			} else if (isSpecificValue(val)) {
				target[key] = cloneSpecificValue(val);
				return;

			// overwrite by new value if source isn't object or array
			} else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
				target[key] = deepExtend({}, val);
				return;

			// source value and new value is objects both, extending...
			} else {
				target[key] = deepExtend(src, val);
				return;
			}
		});
	});

	return target;
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(0);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// CONCATENATED MODULE: ./src/utilities/getModifiersFromProps.js
/**
 * @param {*} props 
 * @param {*} blacklist 
 */
function getModifiersFromProps(props) {
  var blacklist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var modifiers = [];

  for (var prop in props) {
    var _ref = [prop, props[prop]],
        key = _ref[0],
        value = _ref[1];
    var firstLetter = prop[0]; // if prop is name of module, do not include in list

    if (firstLetter === firstLetter.toUpperCase()) {
      continue;
    }

    if (prop === 'subComponent') {
      continue;
    }

    if (typeof value === 'boolean' && value) {
      if (blacklist.indexOf(key) < 0) {
        modifiers.push(key);
      }
    }
  }

  return modifiers;
}
// CONCATENATED MODULE: ./src/utilities/mergeThemes.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function mergeThemes() {
  var THEME = {};

  for (var _len = arguments.length, themes = new Array(_len), _key = 0; _key < _len; _key++) {
    themes[_key] = arguments[_key];
  }

  [].concat(themes).forEach(function (theme) {
    if (typeof theme === 'function') {
      THEME = deepMergeObjects(THEME, theme(THEME));
    } else {
      THEME = deepMergeObjects(THEME, theme);
    }
  });
  return evalVal(THEME);
}
/** */

function evalVal(theme) {
  var THEME = theme;
  Object.entries(THEME).forEach(function (THEME) {
    var key = THEME[0];
    var value = THEME[1];

    if (_typeof(value) === 'object') {
      THEME[key] = evalVal(value);
    }

    if (typeof value === 'function') {
      THEME[key] = value(THEME);
    }
  });
  return THEME;
}
/** */


function deepMergeObjects() {
  if (process.env.SYNERGY) {
    var _Synergy;

    return (_Synergy = Synergy).config.apply(_Synergy, arguments);
  } else if (typeof Synergy !== 'undefined' && typeof Synergy.config === 'function') {
    var _Synergy2;

    return (_Synergy2 = Synergy).config.apply(_Synergy2, arguments);
  } else {
    return __webpack_require__(1).apply(void 0, arguments);
  }
}
// CONCATENATED MODULE: ./src/provider.jsx
function provider_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { provider_typeof = function _typeof(obj) { return typeof obj; }; } else { provider_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return provider_typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (provider_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var ThemeContext = external_react_default.a.createContext({});


var provider_Provider =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Provider, _React$Component);

  function Provider() {
    _classCallCheck(this, Provider);

    return _possibleConstructorReturn(this, _getPrototypeOf(Provider).apply(this, arguments));
  }

  _createClass(Provider, [{
    key: "render",
    value: function render() {
      var theme = this.props.theme;
      return external_react_default.a.createElement(ThemeContext.Provider, {
        value: theme
      }, this.props.children);
    }
  }]);

  return Provider;
}(external_react_default.a.Component);

_defineProperty(provider_Provider, "contextType", ThemeContext);


// CONCATENATED MODULE: ./src/module.jsx
function module_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { module_typeof = function _typeof(obj) { return typeof obj; }; } else { module_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return module_typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { module_defineProperty(target, key, source[key]); }); } return target; }

function module_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function module_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function module_createClass(Constructor, protoProps, staticProps) { if (protoProps) module_defineProperties(Constructor.prototype, protoProps); if (staticProps) module_defineProperties(Constructor, staticProps); return Constructor; }

function module_possibleConstructorReturn(self, call) { if (call && (module_typeof(call) === "object" || typeof call === "function")) { return call; } return module_assertThisInitialized(self); }

function module_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function module_getPrototypeOf(o) { module_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return module_getPrototypeOf(o); }

function module_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) module_setPrototypeOf(subClass, superClass); }

function module_setPrototypeOf(o, p) { module_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return module_setPrototypeOf(o, p); }

function module_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/** spoof env process to assist bundle size */

if (typeof process === 'undefined') window.process = {
  env: {}
  /** Used for generating unique module ID's */

};
var increment = 1;
/** Create a context object */

var ModuleContext = external_react_default.a.createContext({});

/** Render a Synergy module */

var module_Module =
/*#__PURE__*/
function (_React$Component) {
  module_inherits(Module, _React$Component);

  function Module(props) {
    var _this;

    module_classCallCheck(this, Module);

    _this = module_possibleConstructorReturn(this, module_getPrototypeOf(Module).call(this, props));
    _this.REF = external_react_default.a.createRef();
    _this.state = {
      isHovered: false
    };
    return _this;
  }

  module_createClass(Module, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(event) {
      this.props.onMouseEnter && this.props.onMouseEnter(event);
      this.setState({
        isHovered: true
      });
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(event) {
      this.props.onMouseLeave && this.props.onMouseLeave(event);
      this.setState({
        isHovered: false
      });
    }
  }, {
    key: "getEventHandlers",
    value: function getEventHandlers(properties) {
      var eventHandlers = {};

      for (var prop in properties) {
        if (Object.keys(window).includes(prop.toLowerCase())) {
          if (prop === 'theme') {
            continue;
          }

          if (prop !== 'name') {
            eventHandlers[prop] = properties[prop];
          }
        }
      }

      return eventHandlers;
    }
  }, {
    key: "getDataAttributes",
    value: function getDataAttributes(properties) {
      var dataAttributes = {};

      for (var prop in properties) {
        if (prop.indexOf('data-') === 0) {
          dataAttributes[prop] = properties[prop];
        }
      }

      return dataAttributes;
    }
  }, {
    key: "getStyles",
    value: function getStyles() {
      var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 ? arguments[1] : undefined;

      if (typeof styles === 'function') {
        styles = styles(options);
      }

      if (styles instanceof Array) {
        // styles = Module.config({}, ...styles);
        styles = Module.config({}, styles.reduce(function (acc, item) {
          return Object.assign(acc, item);
        }, {}));
      }

      return styles;
    }
  }, {
    key: "stylesConfig",
    value: function stylesConfig() {
      var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.THEME;
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.CONFIG;
      var node = this.REF.current;
      return {
        theme: theme,
        config: config,
        state: _objectSpread({
          isFirstChild: node && node === node.parentNode.firstChild,
          isLastChild: node && node === node.parentNode.lastChild
        }, this.state, this.props),
        element: node,
        context: this.context
      };
    }
  }, {
    key: "paint",
    value: function paint(node) {
      var _this2 = this;

      var styles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 ? arguments[2] : undefined;

      if (typeof styles === 'function') {
        styles = styles(options);
      }

      if (styles instanceof Array) {
        return styles.forEach(function (style) {
          return _this2.paint(node, style, options);
        });
      }

      Object.entries(styles).forEach(function (style) {
        var key = style[0];
        var value = style[1];

        if (value instanceof Array) {
          node = value[0];
          styles = value[1];
          return _this2.paint(node(), styles, options);
        }

        if (typeof value === 'function') {
          try {
            value = (_readOnlyError("value"), value(node.style[key]));
          } catch (error) {
            return error;
          }
        }

        if (key === ':hover' && options.state.isHovered) {
          return _this2.paint(node, value, options);
        }

        try {
          node.style[key] = value;
        } catch (error) {
          return error;
        }
      });
    }
    /** Lifecycle Methods */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.STYLES) {
        this.paint(this.REF.current, this.STYLES, this.stylesConfig());
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.STYLES) {
        this.paint(this.REF.current, this.STYLES, this.stylesConfig());
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      increment++;
      var Synergy = window.Synergy || {};
      var props = this.props;
      /** */

      return external_react_default.a.createElement(ThemeContext.Consumer, null, function (theme) {
        var _objectSpread2;

        /** */
        _this3.THEME = mergeThemes(window.theme, theme, props.theme);
        _this3.CONFIG = Module.config(props.config || {}, _this3.THEME.modules && _this3.THEME.modules[props.name]);
        _this3.STYLES = props.styles;
        /** */

        var MODIFIERGLUE = _this3.CONFIG.modifierGlue || Synergy.modifierGlue || '--';
        var COMPONENTGLUE = _this3.CONFIG.componentGlue || Synergy.componentGlue || '__';
        var ID = props.id || "module-".concat(increment);
        var NAMESPACE = _this3.CONFIG.name || props.name || props.tag || ID;
        var TAG = props.href && 'a' || props.component || props.tag || 'div';
        /** */

        var CLASSES = props.className ? props.className + ' ' : '',
            SELECTOR = NAMESPACE,
            MODIFIERS = [];
        MODIFIERS.push(props.modifiers); // MODIFIERS.push(...getModifiersFromProps(props));

        MODIFIERS = MODIFIERS.concat(getModifiersFromProps(props));
        MODIFIERS = MODIFIERS.filter(function (item, pos) {
          return MODIFIERS.indexOf(item) === pos;
        });
        MODIFIERS = MODIFIERS.filter(Boolean);

        if (_this3.CONFIG.singleClass) {
          SELECTOR += MODIFIERS.length ? MODIFIERGLUE + MODIFIERS.join(MODIFIERGLUE) : '';
        } else {
          MODIFIERS.forEach(function (MODIFIER) {
            return CLASSES += SELECTOR + MODIFIERGLUE + MODIFIER + ' ';
          });
        }

        CLASSES += SELECTOR;
        /** */

        var styles = _this3.getStyles(_this3.STYLES, _this3.stylesConfig());

        var _ref = [styles[':before'], styles[':after']],
            before = _ref[0],
            after = _ref[1];

        var ATTRIBUTES = _objectSpread({}, _this3.getDataAttributes(props), _this3.getEventHandlers(props), props.attributes, {
          onMouseEnter: _this3.handleMouseEnter.bind(_this3),
          onMouseLeave: _this3.handleMouseLeave.bind(_this3),
          className: _this3.CONFIG.generateClasses ? CLASSES : null,
          'data-module': _this3.CONFIG.disableDataAttributes ? null : NAMESPACE
          /** */

        });

        var contextValues = _objectSpread({
          PARENT: _this3
        }, _this3.context, _this3.state, props, (_objectSpread2 = {
          THEME: _this3.THEME,
          CONFIG: _this3.CONFIG,
          MODIFIERGLUE: MODIFIERGLUE,
          COMPONENTGLUE: COMPONENTGLUE
        }, module_defineProperty(_objectSpread2, NAMESPACE, _objectSpread({}, _this3.state, props)), module_defineProperty(_objectSpread2, "STYLES", _objectSpread({}, _this3.context.STYLES, styles)), module_defineProperty(_objectSpread2, "NAMESPACE", NAMESPACE), _objectSpread2));

        return external_react_default.a.createElement(ModuleContext.Provider, {
          value: contextValues
        }, external_react_default.a.createElement(TAG, _extends({
          id: ID,
          ref: _this3.REF
        }, ATTRIBUTES), before && external_react_default.a.createElement("div", {
          className: "before",
          style: before
        }, before.content), props.content || props.children, after && external_react_default.a.createElement("div", {
          className: "after",
          style: after
        }, after.content)));
      });
    }
    /** Static Methods/Properties */

  }]);

  return Module;
}(external_react_default.a.Component);

module_defineProperty(module_Module, "contextType", ModuleContext);

module_defineProperty(module_Module, "config", function () {
  if (process.env.SYNERGY) {
    var _Synergy;

    return (_Synergy = Synergy).config.apply(_Synergy, arguments);
  } else if (typeof Synergy !== 'undefined' && typeof Synergy.config === 'function') {
    var _Synergy2;

    return (_Synergy2 = Synergy).config.apply(_Synergy2, arguments);
  } else {
    return __webpack_require__(1).apply(void 0, arguments);
  }
});


var module_Wrapper =
/*#__PURE__*/
function (_Module) {
  module_inherits(Wrapper, _Module);

  function Wrapper() {
    module_classCallCheck(this, Wrapper);

    return module_possibleConstructorReturn(this, module_getPrototypeOf(Wrapper).apply(this, arguments));
  }

  module_createClass(Wrapper, [{
    key: "render",
    value: function render() {
      var MODULE = this.props.module;
      var NAMESPACE = this.props.name || 'wrapper';

      if (!MODULE) {
        if (this.props.children.length) {
          MODULE = this.props.children[0].type.name.toLowerCase();
        } else {
          MODULE = this.props.children.type.name.toLowerCase();
        }
      }

      var DYNAMICPROPS = module_defineProperty({}, MODULE, true);

      return external_react_default.a.createElement(module_Module, _extends({
        name: NAMESPACE
      }, DYNAMICPROPS, this.props), this.props.children);
    }
  }]);

  return Wrapper;
}(module_Module);
var module_Group =
/*#__PURE__*/
function (_Module2) {
  module_inherits(Group, _Module2);

  function Group() {
    module_classCallCheck(this, Group);

    return module_possibleConstructorReturn(this, module_getPrototypeOf(Group).apply(this, arguments));
  }

  module_createClass(Group, [{
    key: "render",
    value: function render() {
      return external_react_default.a.createElement(module_Wrapper, _extends({
        name: "group"
      }, this.props), this.props.children);
    }
  }]);

  return Group;
}(module_Module);
// CONCATENATED MODULE: ./src/component.jsx
function component_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { component_typeof = function _typeof(obj) { return typeof obj; }; } else { component_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return component_typeof(obj); }

function component_extends() { component_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return component_extends.apply(this, arguments); }

function component_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { component_defineProperty(target, key, source[key]); }); } return target; }

function component_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function component_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function component_createClass(Constructor, protoProps, staticProps) { if (protoProps) component_defineProperties(Constructor.prototype, protoProps); if (staticProps) component_defineProperties(Constructor, staticProps); return Constructor; }

function component_possibleConstructorReturn(self, call) { if (call && (component_typeof(call) === "object" || typeof call === "function")) { return call; } return component_assertThisInitialized(self); }

function component_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function component_getPrototypeOf(o) { component_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return component_getPrototypeOf(o); }

function component_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) component_setPrototypeOf(subClass, superClass); }

function component_setPrototypeOf(o, p) { component_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return component_setPrototypeOf(o, p); }

function component_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * Render a Synergy component
 */

var component_Component =
/*#__PURE__*/
function (_Module) {
  component_inherits(Component, _Module);

  function Component() {
    component_classCallCheck(this, Component);

    return component_possibleConstructorReturn(this, component_getPrototypeOf(Component).apply(this, arguments));
  }

  component_createClass(Component, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.context.STYLES) {
        this.paint(this.REF.current, this.context.STYLES[this.NAMESPACE], this.stylesConfig());
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.context.STYLES) {
        this.paint(this.REF.current, this.context.STYLES[this.NAMESPACE], this.stylesConfig());
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _objectSpread2;

      /** */
      var props = this.props;
      var _this$context = this.context,
          MODIFIERGLUE = _this$context.MODIFIERGLUE,
          COMPONENTGLUE = _this$context.COMPONENTGLUE;
      this.NAMESPACE = props.name || props.tag;
      var STRICT_NAMESPACE = (this.context.STRICT_NAMESPACE || this.context.NAMESPACE) + COMPONENTGLUE + this.NAMESPACE;
      var TAG = props.href && 'a' || props.component || props.tag || 'div';
      /** */

      var CLASSES = props.className ? props.className + ' ' : '',
          MODIFIERS = [];
      var SELECTOR = props.subComponent ? STRICT_NAMESPACE : this.context.NAMESPACE + COMPONENTGLUE + this.NAMESPACE;
      MODIFIERS.push(props.modifiers); // MODIFIERS.push(...getModifiersFromProps(props));

      MODIFIERS = MODIFIERS.concat(getModifiersFromProps(props));
      MODIFIERS = MODIFIERS.filter(function (item, pos) {
        return MODIFIERS.indexOf(item) === pos;
      });
      MODIFIERS = MODIFIERS.filter(Boolean);

      if (this.context.CONFIG.singleClass) {
        SELECTOR += MODIFIERS.length ? MODIFIERGLUE + MODIFIERS.join(MODIFIERGLUE) : '';
      } else {
        MODIFIERS.forEach(function (MODIFIER) {
          return CLASSES += SELECTOR + MODIFIERGLUE + MODIFIER + ' ';
        });
      }

      CLASSES += SELECTOR;
      /** */

      var styles = this.getStyles(this.context.STYLES[this.NAMESPACE], this.stylesConfig());
      var _ref = [styles[':before'], styles[':after']],
          before = _ref[0],
          after = _ref[1];

      var ATTRIBUTES = component_objectSpread({}, this.getDataAttributes(props), this.getEventHandlers(props), props.attributes, {
        onMouseEnter: this.handleMouseEnter.bind(this),
        onMouseLeave: this.handleMouseLeave.bind(this),
        className: this.context.CONFIG.generateClasses ? CLASSES : null,
        'data-component': this.context.CONFIG.disableDataAttributes ? null : this.NAMESPACE,
        'data-sub-component': this.context.CONFIG.disableDataAttributes ? null : props.subComponent
        /** */

      });

      var contextValues = component_objectSpread({}, this.context, this.state, props, (_objectSpread2 = {}, component_defineProperty(_objectSpread2, this.NAMESPACE, component_objectSpread({}, this.state, props)), component_defineProperty(_objectSpread2, "STYLES", component_objectSpread({}, this.context.STYLES, styles)), component_defineProperty(_objectSpread2, "STRICT_NAMESPACE", STRICT_NAMESPACE), _objectSpread2));

      return external_react_default.a.createElement(ModuleContext.Provider, {
        value: contextValues
      }, external_react_default.a.createElement(TAG, component_extends({
        ref: this.REF
      }, ATTRIBUTES), before && external_react_default.a.createElement("div", {
        className: "before",
        style: before
      }, before.content), props.content || props.children, after && external_react_default.a.createElement("div", {
        className: "after",
        style: after
      }, after.content)));
    }
  }]);

  return Component;
}(module_Module);

component_defineProperty(component_Component, "contextType", ModuleContext);


var component_SubComponent = function SubComponent(props) {
  return external_react_default.a.createElement(component_Component, component_extends({
    subComponent: true
  }, props), props.children);
};
// CONCATENATED MODULE: ./src/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BEM", function() { return BEM; });
/* concated harmony reexport Module */__webpack_require__.d(__webpack_exports__, "Module", function() { return module_Module; });
/* concated harmony reexport Wrapper */__webpack_require__.d(__webpack_exports__, "Wrapper", function() { return module_Wrapper; });
/* concated harmony reexport Group */__webpack_require__.d(__webpack_exports__, "Group", function() { return module_Group; });
/* concated harmony reexport Component */__webpack_require__.d(__webpack_exports__, "Component", function() { return component_Component; });
/* concated harmony reexport SubComponent */__webpack_require__.d(__webpack_exports__, "SubComponent", function() { return component_SubComponent; });


/* harmony default export */ var src = __webpack_exports__["default"] = ({
  Module: module_Module,
  Component: component_Component,
  SubComponent: component_SubComponent
});


/***/ })
/******/ ]);