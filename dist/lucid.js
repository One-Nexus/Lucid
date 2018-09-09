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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(11);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getHtmlProps;

var _htmlAttributes = __webpack_require__(13);

var _htmlAttributes2 = _interopRequireDefault(_htmlAttributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        } else if (Object.values(_htmlAttributes2.default).includes(prop)) {
            HtmlProps[prop] = props[prop];
        }
    };

    return HtmlProps;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getModifiersFromProps;
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

        // if prop is name of module, do not include in list

        if (prop[0] === prop[0].toUpperCase()) {
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getModulesFromProps;
/**
 * 
 */
function getModulesFromProps(props, classes) {
    Object.entries(props).forEach(function (prop) {
        if (prop[0][0] === prop[0][0].toUpperCase()) {
            var module = prop[0].toLowerCase();

            var modifiers = '';

            if (prop[1].constructor === Array) {
                modifiers = '-' + prop[1].join('-');
            } else if (typeof prop[1] === 'string') {
                modifiers = '-' + prop[1];
            }

            classes = classes + ' ' + module + modifiers;
        }
    });

    return classes;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = renderModifiers;
/**
 * @param {*} modifiers 
 */
function renderModifiers(modifiers) {
    if (modifiers && (typeof modifiers === 'undefined' ? 'undefined' : _typeof(modifiers)) === 'object' && modifiers.length) {
        return ('-' + modifiers).replace(/,/g, '-');
    }

    return '';
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _synergize = __webpack_require__(8);

Object.defineProperty(exports, 'Synergize', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_synergize).default;
  }
});

var _module = __webpack_require__(9);

Object.defineProperty(exports, 'Module', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_module).default;
  }
});
Object.defineProperty(exports, 'Wrapper', {
  enumerable: true,
  get: function get() {
    return _module.Wrapper;
  }
});
Object.defineProperty(exports, 'Group', {
  enumerable: true,
  get: function get() {
    return _module.Group;
  }
});

var _component = __webpack_require__(15);

Object.defineProperty(exports, 'Component', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_component).default;
  }
});
Object.defineProperty(exports, 'SubComponent', {
  enumerable: true,
  get: function get() {
    return _component.SubComponent;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Construct a Synergy module
 */
var Synergize = function (_React$Component) {
    _inherits(Synergize, _React$Component);

    function Synergize(props, context) {
        _classCallCheck(this, Synergize);

        var _this = _possibleConstructorReturn(this, (Synergize.__proto__ || Object.getPrototypeOf(Synergize)).call(this, props, context));

        try {
            _this.config = global.Synergy.modules[_this.props.name].config;
        } catch (error) {
            _this.config = {};
        }

        try {
            _this.methods = global.Synergy.modules[_this.props.name].methods;
        } catch (error) {
            _this.methods = {};
        }

        for (var method in _this.methods) {
            _this[method] = _this.methods[method];
        }

        _this.content = function (defaults) {
            if (_this.props.content) {
                return defaults;
            }

            if (_this.containsStaticMethodContent(_this.props.children)) {
                return _this.props.children;
            }

            return defaults;
        };
        return _this;
    }

    _createClass(Synergize, [{
        key: 'containsStaticMethodContent',
        value: function containsStaticMethodContent(props) {
            var _this2 = this;

            return Object.entries(props).some(function (prop) {
                var _ref = [prop[0], prop[1]],
                    key = _ref[0],
                    value = _ref[1];


                if (value.constructor === Array) {
                    return value.find(function (prop) {
                        return prop.type === _this2.constructor.content;
                    });
                } else {
                    return value.type === _this2.constructor.content;
                }
            });
        }
    }]);

    return Synergize;
}(_react2.default.Component);

exports.default = Synergize;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Group = exports.Wrapper = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _htmlTags = __webpack_require__(2);

var _htmlTags2 = _interopRequireDefault(_htmlTags);

var _deepExtend = __webpack_require__(12);

var _deepExtend2 = _interopRequireDefault(_deepExtend);

var _getHtmlProps = __webpack_require__(3);

var _getHtmlProps2 = _interopRequireDefault(_getHtmlProps);

var _getModifiersFromProps = __webpack_require__(4);

var _getModifiersFromProps2 = _interopRequireDefault(_getModifiersFromProps);

var _getModulesFromProps = __webpack_require__(5);

var _getModulesFromProps2 = _interopRequireDefault(_getModulesFromProps);

var _renderModifiers = __webpack_require__(6);

var _renderModifiers2 = _interopRequireDefault(_renderModifiers);

var _refHandler = __webpack_require__(14);

var _refHandler2 = _interopRequireDefault(_refHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Used for generating unique module ID's
 */
var increment = 1;

/**
 * Render a Synergy module
 *
 * @extends React.Component
 */

var Module = function (_React$Component) {
    _inherits(Module, _React$Component);

    function Module(props, context) {
        _classCallCheck(this, Module);

        var _this = _possibleConstructorReturn(this, (Module.__proto__ || Object.getPrototypeOf(Module)).call(this, props, context));

        increment++;

        _this.tag = props.component || props.tag || (_htmlTags2.default.includes(props.name) ? props.name : 'div');
        _this.propModifiers = (0, _renderModifiers2.default)((0, _getModifiersFromProps2.default)(props, Synergy.CssClassProps));
        _this.passedModifiers = (0, _renderModifiers2.default)(props.modifiers);
        _this.modifiers = _this.propModifiers + _this.passedModifiers;
        _this.classes = props.className ? ' ' + props.className : '';
        _this.classNames = (0, _getModulesFromProps2.default)(props, props.name + _this.modifiers + _this.classes);
        _this.id = (props.before || props.after) && !props.id ? 'synergy-module-' + increment : props.id;
        _this.ref = function (node) {
            return (0, _refHandler2.default)(node, props);
        };
        _this.styleParser = props.styleParser || Synergy.styleParser;

        if (Synergy.CssClassProps) Synergy.CssClassProps.forEach(function (prop) {
            if (Object.keys(props).includes(prop)) {
                _this.classNames = _this.classNames + ' ' + prop;
            }
        });
        return _this;
    }

    _createClass(Module, [{
        key: 'getChildContext',
        value: function getChildContext() {
            var config = void 0;

            try {
                config = global.Synergy.modules[this.props.name].config;
            } catch (error) {
                config = null;
            }

            return {
                module: this.props.name,
                modifiers: this.props.modifiers,
                config: config,
                props: this.props
            };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _module = Synergy.modules ? Synergy.modules[this.props.name] : null;

            if (_module && _module.methods) {
                if (_module.methods.init) {
                    _module.methods.init(_reactDom2.default.findDOMNode(this), this.config);
                }
            }
        }
    }, {
        key: 'getEventHandlers',
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
        key: 'getDataAttributes',
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
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                this.props.before && this.props.before(function () {
                    return document.getElementById(_this2.id);
                }),
                _react2.default.createElement(
                    this.tag,
                    _extends({
                        id: this.id,
                        className: this.classNames,
                        'data-module': this.props.name,
                        ref: function ref(node, props) {
                            return _this2.ref(node, props, _this2.styleParser);
                        }

                    }, (0, _getHtmlProps2.default)(this.props), this.getDataAttributes(this.props), this.getEventHandlers(this.props), this.props.componentProps),
                    this.props.children
                ),
                this.props.after && this.props.after(function () {
                    return document.getElementById(_this2.id);
                })
            );
        }
    }]);

    return Module;
}(_react2.default.Component);

exports.default = Module;


Module.config = _deepExtend2.default;

Module.childContextTypes = {
    module: _propTypes2.default.string,
    modifiers: _propTypes2.default.array,
    config: _propTypes2.default.object,
    props: _propTypes2.default.object
};

var Wrapper = exports.Wrapper = function (_Module) {
    _inherits(Wrapper, _Module);

    function Wrapper(props, context) {
        _classCallCheck(this, Wrapper);

        var _this3 = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props, context));

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
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                Module,
                _extends({ name: this.namespace }, this.dynamicProps, this.props),
                this.props.children
            );
        }
    }]);

    return Wrapper;
}(Module);

var Group = exports.Group = function (_Module2) {
    _inherits(Group, _Module2);

    function Group() {
        _classCallCheck(this, Group);

        return _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).apply(this, arguments));
    }

    _createClass(Group, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                Wrapper,
                _extends({ name: 'group' }, this.props),
                this.props.children
            );
        }
    }]);

    return Group;
}(Module);

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = ["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","math","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"]

/***/ }),
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = refHandler;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Handle the ref callback on the rendered React component
 * 
 * @param {HTMLElement} node - the DOM element of the rendered React component
 * @param {Object} props - the props of the React component
 * @param {*} styleParser 
 */
function refHandler(node, props, styleParser) {
    if (node) {
        if (props.styles && styleParser) {
            styleParser.apply(undefined, [node].concat(_toConsumableArray(props.styles)));
        }

        if (props.init) {
            props.init(node);
        }
    }
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SubComponent = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _htmlTags = __webpack_require__(2);

var _htmlTags2 = _interopRequireDefault(_htmlTags);

var _getHtmlProps = __webpack_require__(3);

var _getHtmlProps2 = _interopRequireDefault(_getHtmlProps);

var _getModifiersFromProps = __webpack_require__(4);

var _getModifiersFromProps2 = _interopRequireDefault(_getModifiersFromProps);

var _getModulesFromProps = __webpack_require__(5);

var _getModulesFromProps2 = _interopRequireDefault(_getModulesFromProps);

var _getParam = __webpack_require__(16);

var _getParam2 = _interopRequireDefault(_getParam);

var _renderModifiers = __webpack_require__(6);

var _renderModifiers2 = _interopRequireDefault(_renderModifiers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Render a Synergy component
 *
 * @extends React.Component
 */
var Component = function (_React$Component) {
    _inherits(Component, _React$Component);

    function Component(props, context) {
        _classCallCheck(this, Component);

        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, props, context));

        _this.config = context.config || {};
        _this.tag = props.component || props.tag || (_htmlTags2.default.includes(props.name) ? props.name : 'div');
        _this.module = props.module || context.module;
        _this.propModifiers = (0, _renderModifiers2.default)((0, _getModifiersFromProps2.default)(props, Synergy.CssClassProps));
        _this.contextModifiers = (0, _renderModifiers2.default)((0, _getModifiersFromProps2.default)(context.props && context.props[props.name], Synergy.CssClassProps));
        _this.passedModifiers = (0, _renderModifiers2.default)(props.modifiers);
        _this.modifiers = _this.propModifiers + _this.passedModifiers + _this.contextModifiers;
        _this.classes = (0, _getModulesFromProps2.default)(props, props.className ? ' ' + props.className : '');
        _this.selector = (_this.module + '_' + (props.name + _this.modifiers) + _this.classes).replace(/,/g, '_');

        _this.getEventHandlers([props, _this.config[props.name] ? _this.config[props.name] : {}]);

        if (props.href) _this.tag = 'a';
        return _this;
    }

    _createClass(Component, [{
        key: 'getEventHandlers',
        value: function getEventHandlers(properties) {
            var _this2 = this;

            this.eventHandlers = this.eventHandlers || {};

            if (properties.constructor === Array) {
                properties.forEach(function (group) {
                    return _this2.getEventHandlers(group);
                });
            } else for (var key in properties) {
                var value = properties[key];

                if (key.indexOf('event') === 0 || key.indexOf('[') === 0) {
                    this.eventHandlers[(0, _getParam2.default)(key)] = Synergy.modules[this.module].methods[value];
                }

                if (Object.keys(window).includes(key.toLowerCase())) {
                    if (typeof value === 'function') {
                        this.eventHandlers[key] = value;
                    } else {
                        //@TODO be smarter here, don't hardcode any properties
                        if (key !== 'name') {
                            this.eventHandlers[key] = Synergy.modules[this.module].methods[value];
                        }
                    }
                }

                if (key.indexOf('modifier') === 0 || key.indexOf('-') === 0) {
                    if (this.props.modifiers && this.props.modifiers.includes((0, _getParam2.default)(key))) {
                        this.getEventHandlers(value);
                    }
                }
            }
        }
    }, {
        key: 'isNested',
        value: function isNested() {
            try {
                return this.constructor.name === this.props.children.type.name;
            } catch (error) {
                return false;
            }
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                component: this.props.name
            };
        }
    }, {
        key: 'renderTag',
        value: function renderTag(props) {
            return _react2.default.createElement(
                this.tag,
                _extends({}, (0, _getHtmlProps2.default)(props), this.eventHandlers, {

                    className: this.selector,
                    'data-component': props.name
                }),
                props.children
            );
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.isNested()) {
                var parentKeys = Object.keys(this.props).sort();
                var childKeys = Object.keys(this.props.children.props).sort();
                var sameAsParent = this.props.name === this.props.children.props.name;

                if (JSON.stringify(parentKeys) === JSON.stringify(childKeys) && sameAsParent) {
                    return this.props.children;
                }

                return this.renderTag(this.props);
            } else return this.renderTag(this.props);
        }
    }]);

    return Component;
}(_react2.default.Component);

exports.default = Component;


Component.contextTypes = {
    module: _propTypes2.default.string,
    modifiers: _propTypes2.default.array,
    component: _propTypes2.default.string,
    subComponent: _propTypes2.default.array,
    config: _propTypes2.default.object,
    props: _propTypes2.default.object
};

Component.childContextTypes = {
    component: _propTypes2.default.string
};

var SubComponent = exports.SubComponent = function (_Component) {
    _inherits(SubComponent, _Component);

    function SubComponent(props, context) {
        _classCallCheck(this, SubComponent);

        var _this3 = _possibleConstructorReturn(this, (SubComponent.__proto__ || Object.getPrototypeOf(SubComponent)).call(this, props, context));

        var namespace = context.component + '_' + props.name;

        if (context.subComponent) {
            namespace = namespace + '_' + context.subComponent.join('_');
        }

        _this3.selector = _this3.module + '_' + (namespace + _this3.modifiers) + _this3.classes;
        return _this3;
    }

    _createClass(SubComponent, [{
        key: 'getChildContext',
        value: function getChildContext() {
            var subComponents = this.context.subComponent || [];

            subComponents.push(this.props.name);

            return {
                subComponent: subComponents
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return this.renderTag(this.props);
        }
    }]);

    return SubComponent;
}(Component);

SubComponent.childContextTypes = {
    subComponent: _propTypes2.default.array
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getParam;
function getParam(property) {
    if (property.match(/\((.*?)\)/)) {
        return property.match(/\((.*?)\)/)[1].replace(/'/g, '');
    }
    if (property.match(/\[(.*?)\]/)) {
        return property.match(/\[(.*?)\]/)[1];
    }
    if (property.indexOf('-') === 0) {
        return property.slice(1);
    }
}

/***/ })
/******/ ]);