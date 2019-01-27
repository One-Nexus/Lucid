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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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

module.exports = __webpack_require__(4);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * html-attributes
 * https://github.com/alexmingoia/html-attributes
 */



/**
 * @module html-attributes
 */

module.exports = {
  "abbr": "abbr",
  "accept": "accept",
  "acceptCharset": "accept-charset",
  "accessKey": "accesskey",
  "action": "action",
  "allowFullScreen": "allowfullscreen",
  "allowTransparency": "allowtransparency",
  "alt": "alt",
  "async": "async",
  "autoComplete": "autocomplete",
  "autoFocus": "autofocus",
  "autoPlay": "autoplay",
  "cellPadding": "cellpadding",
  "cellSpacing": "cellspacing",
  "challenge": "challenge",
  "charset": "charset",
  "checked": "checked",
  "cite": "cite",
  "class": "class",
  "className": "class",
  "cols": "cols",
  "colSpan": "colspan",
  "command": "command",
  "content": "content",
  "contentEditable": "contenteditable",
  "contextMenu": "contextmenu",
  "controls": "controls",
  "coords": "coords",
  "crossOrigin": "crossorigin",
  "data": "data",
  "dateTime": "datetime",
  "default": "default",
  "defer": "defer",
  "dir": "dir",
  "disabled": "disabled",
  "download": "download",
  "draggable": "draggable",
  "dropzone": "dropzone",
  "encType": "enctype",
  "for": "for",
  "form": "form",
  "formAction": "formaction",
  "formEncType": "formenctype",
  "formMethod": "formmethod",
  "formNoValidate": "formnovalidate",
  "formTarget": "formtarget",
  "frameBorder": "frameBorder",
  "headers": "headers",
  "height": "height",
  "hidden": "hidden",
  "high": "high",
  "href": "href",
  "hrefLang": "hreflang",
  "htmlFor": "for",
  "httpEquiv": "http-equiv",
  "icon": "icon",
  "id": "id",
  "inputMode": "inputmode",
  "isMap": "ismap",
  "itemId": "itemid",
  "itemProp": "itemprop",
  "itemRef": "itemref",
  "itemScope": "itemscope",
  "itemType": "itemtype",
  "kind": "kind",
  "label": "label",
  "lang": "lang",
  "list": "list",
  "loop": "loop",
  "manifest": "manifest",
  "max": "max",
  "maxLength": "maxlength",
  "media": "media",
  "mediaGroup": "mediagroup",
  "method": "method",
  "min": "min",
  "minLength": "minlength",
  "multiple": "multiple",
  "muted": "muted",
  "name": "name",
  "noValidate": "novalidate",
  "open": "open",
  "optimum": "optimum",
  "pattern": "pattern",
  "ping": "ping",
  "placeholder": "placeholder",
  "poster": "poster",
  "preload": "preload",
  "radioGroup": "radiogroup",
  "readOnly": "readonly",
  "rel": "rel",
  "required": "required",
  "role": "role",
  "rows": "rows",
  "rowSpan": "rowspan",
  "sandbox": "sandbox",
  "scope": "scope",
  "scoped": "scoped",
  "scrolling": "scrolling",
  "seamless": "seamless",
  "selected": "selected",
  "shape": "shape",
  "size": "size",
  "sizes": "sizes",
  "sortable": "sortable",
  "span": "span",
  "spellCheck": "spellcheck",
  "src": "src",
  "srcDoc": "srcdoc",
  "srcSet": "srcset",
  "start": "start",
  "step": "step",
  "style": "style",
  "tabIndex": "tabindex",
  "target": "target",
  "title": "title",
  "translate": "translate",
  "type": "type",
  "typeMustMatch": "typemustmatch",
  "useMap": "usemap",
  "value": "value",
  "width": "width",
  "wmode": "wmode",
  "wrap": "wrap"
};


/***/ }),
/* 4 */
/***/ (function(module) {

module.exports = ["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","math","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(0);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// EXTERNAL MODULE: external "react-dom"
var external_react_dom_ = __webpack_require__(2);
var external_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_react_dom_);

// EXTERNAL MODULE: ./node_modules/html-tags/index.js
var html_tags = __webpack_require__(1);
var html_tags_default = /*#__PURE__*/__webpack_require__.n(html_tags);

// EXTERNAL MODULE: ./node_modules/html-attributes/lib/html-attributes.js
var html_attributes = __webpack_require__(3);
var html_attributes_default = /*#__PURE__*/__webpack_require__.n(html_attributes);

// CONCATENATED MODULE: ./src/utilities/getHtmlProps.js

/**
 * Get element HTML attributes from props
 * @param {*} props 
 */

function getHtmlProps(props) {
  var HtmlProps = {};

  for (var prop in props) {
    if (prop === 'name') {
      continue;
    } else if (prop === 'modifiers') {
      continue;
    } else if (prop === 'tag') {
      continue;
    } else if (prop === 'elementname') {
      HtmlProps.name = props[prop];
    } else if (prop.indexOf('html') === 0) {
      HtmlProps[prop] = props[prop];
    } else if (Object.values(html_attributes_default.a).includes(prop)) {
      HtmlProps[prop] = props[prop];
    }
  }

  ;
  return HtmlProps;
}
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
      if (blacklist && blacklist.indexOf(key) < 0) {
        modifiers.push(key);
      }
    }
  }

  return modifiers;
}
// CONCATENATED MODULE: ./src/utilities/generateClasses.js
/**
 * Generate CSS classes for a module
 */
function generateClasses(props, classes, modifierGlue) {
  // Get modules from props
  Object.entries(props).forEach(function (prop) {
    var firstLetter = prop[0][0];

    if (firstLetter === firstLetter.toUpperCase()) {
      var module = prop[0].toLowerCase();
      var modifiers = '';

      if (prop[1].constructor === Array) {
        modifiers = modifierGlue + prop[1].join(modifierGlue);
      } else if (typeof prop[1] === 'string') {
        modifiers = modifierGlue + prop[1];
      }

      classes = classes + ' ' + module + modifiers;
    }
  });
  return classes;
}
// CONCATENATED MODULE: ./src/utilities/renderModifiers.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @param {*} modifiers 
 */
function renderModifiers(modifiers, modifierGlue) {
  if (modifiers && _typeof(modifiers) === 'object' && modifiers.length) {
    return (modifierGlue + modifiers).replace(/,/g, modifierGlue);
  }

  return '';
}
// CONCATENATED MODULE: ./src/utilities/refHandler.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Handle the ref callback on the rendered React component
 */
function refHandler(node, props, styleParser, parentModule, ui, config) {
  if (node && node instanceof HTMLElement) {
    Object.assign(node, {
      isFirstChild: node === node.parentNode.firstChild,
      isLastChild: node === node.parentNode.lastChild
    });

    if (parentModule && window[props.name] && window[props.name].defaults) {
      node.config = config;
    }

    if (styleParser) {
      if (props.styles) {
        styleParser.apply(void 0, [node].concat(_toConsumableArray(props.styles)));
      } else if (props.name && window[props.name]) {
        if (window[props.name] && window[props.name].layout) {
          styleParser(node, window[props.name].layout, config, ui);
        }
      }

      Object.keys(props).forEach(function (prop) {
        var fistLetter = prop[0];

        if (fistLetter === fistLetter.toUpperCase()) {
          if (window[prop] && window[prop].layout && window[prop].config) {
            node.namespace = node.namespace || prop;
            styleParser(node, window[prop].layout, window[prop].config, ui);
          }
        }
      });
    }

    if (props.init) {
      props.init(node);
    } else if (window[props.name] && window[props.name].init) {
      window[props.name].init(node);
    }
  }
}
// CONCATENATED MODULE: ./src/module.jsx
function module_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { module_typeof = function _typeof(obj) { return typeof obj; }; } else { module_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return module_typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (module_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








 // spoof env process to assist bundle size

if (typeof process === 'undefined') window.process = {
  env: {}
};
/**
 * Used for generating unique module ID's
 */

var increment = 1;
/**
 * Create a context object
 */

var ModuleContext = external_react_default.a.createContext();

/**
 * Render a Synergy module
 *
 * @extends React.Component
 */

var module_Module =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Module, _React$Component);

  function Module(props) {
    var _this;

    _classCallCheck(this, Module);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Module).call(this, props));
    increment++;
    var Synergy = window.Synergy || {};
    var ui = props.ui || window.ui;
    var modifierGlue = props.modifierGlue || Synergy.modifierGlue || '-';
    var componentGlue = props.componentGlue || Synergy.componentGlue || '_';
    var propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CssClassProps), modifierGlue);
    var passedModifiers = renderModifiers(props.modifiers, modifierGlue);
    var modifiers = propModifiers + passedModifiers;
    var classes = props.className ? ' ' + props.className : '';
    var styleParser = props.styleParser || Synergy.styleParser;
    _this.config = props.config || {};

    if (window[props.name]) {
      _this.config = Module.config(window[props.name].config, _this.config);
    }

    _this.namespace = _this.config.name || props.name;

    _this.ref = function (node) {
      return refHandler(node, props, styleParser, true, ui, _this.config);
    };

    _this.id = (props.before || props.after) && !props.id ? "synergy-module-".concat(increment) : props.id;
    _this.tag = props.tag || (html_tags_default.a.includes(_this.namespace) ? _this.namespace : 'div');
    _this.classNames = generateClasses(props, _this.namespace + modifiers + classes, modifierGlue);
    if (Synergy.CssClassProps) Synergy.CssClassProps.forEach(function (prop) {
      if (Object.keys(props).includes(prop)) {
        _this.classNames = _this.classNames + ' ' + prop;
      }
    });
    _this.contextValue = {
      ui: ui,
      styleParser: styleParser,
      modifierGlue: modifierGlue,
      componentGlue: componentGlue,
      module: _this.namespace,
      props: _this.props,
      config: _this.config
    };
    return _this;
  }

  _createClass(Module, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _module = Synergy.modules ? Synergy.modules[this.namespace] : null;

      if (_module && _module.methods) {
        if (_module.methods.init) {
          _module.methods.init(external_react_dom_default.a.findDOMNode(this), this.config);
        }
      }
    }
  }, {
    key: "getEventHandlers",
    value: function getEventHandlers(properties) {
      var eventHandlers = {};

      for (var prop in properties) {
        if (Object.keys(window).includes(prop.toLowerCase())) {
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
    key: "render",
    value: function render() {
      var _this2 = this;

      return external_react_default.a.createElement(ModuleContext.Provider, {
        value: this.contextValue
      }, this.props.before && this.props.before(function () {
        return document.getElementById(_this2.id);
      }), external_react_default.a.createElement(this.tag, _extends({
        id: this.id,
        className: this.classNames,
        "data-module": this.namespace,
        ref: this.ref
      }, getHtmlProps(this.props), this.getDataAttributes(this.props), this.getEventHandlers(this.props), this.props.componentProps), this.props.children), this.props.after && this.props.after(function () {
        return document.getElementById(_this2.id);
      }));
    }
  }]);

  return Module;
}(external_react_default.a.Component);

_defineProperty(module_Module, "config", function () {
  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  // `process` and `require` are exploited to help reduce bundle size
  if (process.env.SYNERGY) {
    var _Synergy;

    return (_Synergy = Synergy).config.apply(_Synergy, [{}].concat(params));
  } else if (typeof Synergy !== 'undefined' && typeof Synergy.config === 'function') {
    var _Synergy2;

    return (_Synergy2 = Synergy).config.apply(_Synergy2, [{}].concat(params));
  } else {
    return __webpack_require__(5).apply(void 0, [{}].concat(params));
  }
});

_defineProperty(module_Module, "child", function (props) {
  var childProps = Object.assign({}, props);
  delete childProps.children;
  var config = props.config || {};

  if (window[props.name]) {
    config = module_Module.config(window[props.name].config, config);
  }

  return external_react_default.a.Children.map(props.children, function (child) {
    return external_react_default.a.cloneElement(child, {
      context: childProps,
      config: config
    });
  });
});


var module_Wrapper =
/*#__PURE__*/
function (_Module) {
  _inherits(Wrapper, _Module);

  function Wrapper(props) {
    var _this3;

    _classCallCheck(this, Wrapper);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Wrapper).call(this, props));
    _this3.module = props.module;
    _this3.namespace = props.name || 'wrapper';

    if (!_this3.module) {
      if (props.children.length) {
        _this3.module = props.children[0].type.name.toLowerCase();
      } else {
        _this3.module = props.children.type.name.toLowerCase();
      }
    }

    _this3.dynamicProps = _defineProperty({}, _this3.module, true);
    return _this3;
  }

  _createClass(Wrapper, [{
    key: "render",
    value: function render() {
      return external_react_default.a.createElement(module_Module, _extends({
        name: this.namespace
      }, this.dynamicProps, this.props), this.props.children);
    }
  }]);

  return Wrapper;
}(module_Module);
var module_Group =
/*#__PURE__*/
function (_Module2) {
  _inherits(Group, _Module2);

  function Group() {
    _classCallCheck(this, Group);

    return _possibleConstructorReturn(this, _getPrototypeOf(Group).apply(this, arguments));
  }

  _createClass(Group, [{
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { component_defineProperty(target, key, source[key]); }); } return target; }

function component_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function component_extends() { component_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return component_extends.apply(this, arguments); }

function component_toConsumableArray(arr) { return component_arrayWithoutHoles(arr) || component_iterableToArray(arr) || component_nonIterableSpread(); }

function component_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function component_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function component_arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function component_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function component_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function component_createClass(Constructor, protoProps, staticProps) { if (protoProps) component_defineProperties(Constructor.prototype, protoProps); if (staticProps) component_defineProperties(Constructor, staticProps); return Constructor; }

function component_possibleConstructorReturn(self, call) { if (call && (component_typeof(call) === "object" || typeof call === "function")) { return call; } return component_assertThisInitialized(self); }

function component_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function component_getPrototypeOf(o) { component_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return component_getPrototypeOf(o); }

function component_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) component_setPrototypeOf(subClass, superClass); }

function component_setPrototypeOf(o, p) { component_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return component_setPrototypeOf(o, p); }









var ComponentContext = external_react_default.a.createContext();
/**
 * Render a Synergy component
 */

var component_Component =
/*#__PURE__*/
function (_React$Component) {
  component_inherits(Component, _React$Component);

  function Component() {
    component_classCallCheck(this, Component);

    return component_possibleConstructorReturn(this, component_getPrototypeOf(Component).apply(this, arguments));
  }

  component_createClass(Component, [{
    key: "getEventHandlers",
    value: function getEventHandlers(properties) {
      var _this = this;

      var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (properties.constructor === Array) {
        properties.forEach(function (group) {
          return _this.getEventHandlers(group, handlers);
        });
      } else for (var key in properties) {
        var value = properties[key];

        if (Object.keys(window).includes(key.toLowerCase())) {
          if (typeof value === 'function') {
            handlers[key] = value;
          }
        }
      }

      return handlers;
    }
  }, {
    key: "renderTag",
    value: function renderTag(props, context, subComponent) {
      var modifierGlue = context.modifierGlue,
          componentGlue = context.componentGlue;
      var module = props.module || context.module;
      var propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CssClassProps), modifierGlue);
      var getContextModifiers = getModifiersFromProps(context.props && context.props[props.name], Synergy.CssClassProps);
      var contextModifiers = renderModifiers(getContextModifiers, modifierGlue);
      var passedModifiers = renderModifiers(props.modifiers, modifierGlue);
      var classes = generateClasses(props, props.className ? ' ' + props.className : '', modifierGlue);
      var modifiers = propModifiers + passedModifiers + contextModifiers;
      var eventHandlers = this.getEventHandlers([props, context.config[props.name] ? context.config[props.name] : {}]);
      var Tag = props.href && 'a' || props.component || props.tag || (html_tags_default.a.includes(props.name) ? props.name : 'div');

      var ref = function ref(node) {
        return refHandler(node, props, context.styleParser, false, context.ui);
      };

      var selector = '';

      if (props.name instanceof Array) {
        props.name.forEach(function (name) {
          return selector = (selector ? selector + ' ' : '') + "".concat(module + componentGlue + name + modifiers);
        });
        selector = selector + classes;
      } else {
        selector = "".concat(module + componentGlue + props.name + modifiers) + classes;
      }

      var contextValues = {
        component: context.component
      };

      if (subComponent) {
        contextValues.subComponent = [].concat(component_toConsumableArray(context.subComponent || []), [props.name]);
        var subComponents = contextValues.subComponent.length ? contextValues.subComponent.join(componentGlue) : '';
        var namespace = "".concat((context.component || props.name) + componentGlue + subComponents);
        selector = "".concat(module + componentGlue + namespace + modifiers + classes);
      } else {
        contextValues.component = props.name;
      }

      return external_react_default.a.createElement(ComponentContext.Provider, {
        value: contextValues
      }, external_react_default.a.createElement(Tag, component_extends({}, getHtmlProps(props), eventHandlers, {
        ref: ref,
        className: selector,
        "data-component": props.name.constructor === Array ? props.name[0] : props.name
      }, this.props.componentProps), props.children));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return external_react_default.a.createElement(ModuleContext.Consumer, null, function (context) {
        if (_this2.props.subComponent) {
          return external_react_default.a.createElement(ComponentContext.Consumer, null, function (componentContext) {
            return _this2.renderTag(_this2.props, _objectSpread({}, context, componentContext), true);
          });
        }

        return _this2.renderTag(_this2.props, context);
      });
    }
  }]);

  return Component;
}(external_react_default.a.Component);


var component_SubComponent = function SubComponent(props) {
  return external_react_default.a.createElement(component_Component, component_extends({
    subComponent: true
  }, props), props.children);
};
// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport Module */__webpack_require__.d(__webpack_exports__, "Module", function() { return module_Module; });
/* concated harmony reexport Wrapper */__webpack_require__.d(__webpack_exports__, "Wrapper", function() { return module_Wrapper; });
/* concated harmony reexport Group */__webpack_require__.d(__webpack_exports__, "Group", function() { return module_Group; });
/* concated harmony reexport Component */__webpack_require__.d(__webpack_exports__, "Component", function() { return component_Component; });
/* concated harmony reexport SubComponent */__webpack_require__.d(__webpack_exports__, "SubComponent", function() { return component_SubComponent; });



/***/ })
/******/ ]);