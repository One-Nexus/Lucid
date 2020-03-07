import htmlVoidElements from 'html-void-elements';
import evalTheme from '../utilities/evalTheme';
import getModifiersFromProps from '../utilities/getModifiersFromProps';
import mergeThemes from '../utilities/mergeThemes';
import deepextend from '../utilities/deepMergeObjects';
import generateElementClasses from '../utilities/generateElementClasses';
import { UIContext } from './provider';

if (typeof React === 'undefined') {
  var React = require('react');
}

/** spoof env process to assist bundle size */
if (typeof process === 'undefined') window.process = { env: {} }

/** Used for generating unique module ID's */
let increment = 1;

/** Create a context object */
export const ModuleContext = React.createContext({});

/** Render a Synergy module */
export default class Module extends React.Component {
  constructor(props, context = {}) {
    super(props);

    increment++;

    var Synergy = window.Synergy || {};

    this.REF = React.createRef();
    this.DATA = props.styles;
    this.THEME = evalTheme(mergeThemes(context.theme, window.theme, props.theme));
    this.UTILS = context.utils || window.utils;

    const LUCIDDEFAULTS = { generateClasses: true, generateDataAttributes: true, singleClass: false }
    const GLOBAL_MODULE = window[props.name];
    const RAW_DEFAULTS = GLOBAL_MODULE && GLOBAL_MODULE.defaultProps && GLOBAL_MODULE.defaultProps.config;
    
    let PROPCONFIG = (typeof props.config === 'function') ? props.config(this.THEME) : props.config;
    let DEFAULTS = (typeof RAW_DEFAULTS === 'function') ? RAW_DEFAULTS(this.THEME) : RAW_DEFAULTS;
    let THEMECONFIG = this.THEME.modules && this.THEME.modules[props.name];

    if (THEMECONFIG && JSON.stringify(DEFAULTS) === JSON.stringify(PROPCONFIG)) {
      PROPCONFIG = null;
    }

    if (PROPCONFIG && PROPCONFIG.displace) {
      DEFAULTS = {}, THEMECONFIG = {}
    }

    this.CONFIG = deepextend(LUCIDDEFAULTS, DEFAULTS, THEMECONFIG, PROPCONFIG);
    this.ID = props.id || `module-${increment}`;
    this.NAMESPACE = this.CONFIG.name || props.name || props.tag || this.ID;
    this.TAG = (props.href && 'a') || props.component || props.tag || 'div';
    this.MODIFIERGLUE = props.modifierGlue || this.CONFIG.modifierGlue || Synergy.modifierGlue || '--';
    this.COMPONENTGLUE = props.componentGlue || this.CONFIG.componentGlue || Synergy.componentGlue || '__';

    this.SINGLECLASS = props.singleClass ?? this.THEME.singleClass ?? this.CONFIG.singleClass;
    this.GENERATECLASSES = props.generateClasses ?? this.THEME.generateClasses ?? this.CONFIG.generateClasses;
    this.GENERATEDATAATTRIBUTES = props.generateDataAttributes ?? this.THEME.generateDataAttributes ?? this.CONFIG.generateDataAttributes;

    this.ACTORMODULES = Object.keys(props).filter(key => key[0] === key[0].toUpperCase()).reduce((obj, key) => {
      return obj[key] = props[key], obj;
    }, {});

    this.state = {}
  }

  /** Get Attributes */

  getEventHandlers(properties) {
    let eventHandlers = {}

    for (let prop in properties) {
      if (Object.keys(window).includes(prop.toLowerCase())) {
        if (prop === 'theme') {
          continue;
        }

        // edge case
        if (prop === 'Alert') {
          continue;
        }

        if (prop !== 'name') {
          eventHandlers[prop] = properties[prop];
        }
      }
    }

    return eventHandlers;
  }

  getInputAttributes(properties) {
    let inputAttributes = {}

    const whitelist = [
      'type',
      'value',
      'readonly',
      'disabled',
      'size',
      'maxlength',
      'autocomplete',
      'autofocus',
      'min',
      'max',
      'multiple',
      'pattern',
      'placeholder',
      'required',
      'step'
    ];

    for (let prop in properties) {
      if (whitelist.includes(prop)) {
        inputAttributes[prop] = properties[prop];
      }
    }

    return inputAttributes;
  }

  getDataAttributes(properties) {
    let dataAttributes = {}

    for (let prop in properties) {
      if (prop.indexOf('data-') === 0) {
        dataAttributes[prop] = properties[prop];
      }
    }

    return dataAttributes;
  }

  /** Styling */

  stylesConfig({ theme = this.THEME, config = this.CONFIG, context = this.CONTEXT, utils = this.UTILS, state } = {}) {
    return {
      theme,
      config,
      context,
      utils,
      state: {
        ...this.state,
        ...this.props,
        ...state
      },
      element: this.REF.current || document.createElement('span')
    }
  }

  getStyles(styles = {}, options) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      styles = this.flattenStyles(styles, options);
    }
  
    return styles;
  }

  flattenStyles(styles, options) {
    return styles.reduce((accumulator, item) => {
      if (!item) return accumulator;

      if (typeof item === 'function') {
        item = item(options);
      }

      Object.entries(item).forEach(entry => {
        const key = entry[0]; const val = entry[1];

        if (accumulator.hasOwnProperty(key)) {
          accumulator[key] = accumulator[key] instanceof Array ? accumulator[key].concat(val) : [accumulator[key], val];
        } else {
          accumulator[key] = val;
        }
      });

      return accumulator;
    }, {});
  }

  paint(node, styles = {}, options, { prevNamespace, prevContext } = {}) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      return styles.forEach(style => this.paint(node, style, options));
    }
  
    /**
     * Cell Query
     */
    Object.entries(styles).forEach(style => {
      const key = style[0]; let value = style[1];

      /**
       * Determine if current node is queried modifier/state
       */
      if (key.indexOf('is-') === 0) {
        const CONTEXT = key.replace('is-', '');

        if (options.state.name === ':before' || options.state.name === ':after') {
          options = options.context[options.state.referer];
        }

        if (options[CONTEXT] || options.state[CONTEXT]) {
          return this.paint(node, value, options);
        }

        return;
      }

      /**
       * Determine if parent module/block is queried modifier/state
       */
      if (key.indexOf('$-is-') === 0 || key.indexOf('$:') === 0) {
        const MODULE = options.context.NAMESPACE;
        const CONTEXT = key.indexOf('$:') === 0 ? key.slice(1, key.length) : key.slice(5, key.length);

        if (options.context[MODULE][CONTEXT]) {
          return this.paint(node, value, options);
        }

        return;
      }

      /**
       * Determine if previously specified parent component is queried modifier/state
       */
      if (key.indexOf('and-is-') === 0 || key.indexOf('and:') === 0) {
        const CONTEXT = key.indexOf('and:') === 0 ? key.replace('and', '') : key.replace('and-is-', '');

        if (options.context[prevNamespace][CONTEXT]) {
          return this.paint(node, value, options, { prevNamespace });
        }

        return;
      }

      /**
       * Determine if specified parent component is queried modifier/state
       */
      if (key.indexOf('-is-') > -1 || key.indexOf(':') > 0) {
        const COMPONENT = key.indexOf(':') > 0 ? key.slice(0, key.indexOf(':')) : key.slice(0, key.indexOf('-is-'));
        const CONTEXT = key.indexOf(':') > 0 ? key.slice(key.indexOf(':'), key.length) : key.slice(key.indexOf('-is-') + 4, key.length);

        if (options.context[COMPONENT][CONTEXT]) {
          return this.paint(node, value, options, { 
            prevNamespace: COMPONENT
          });
        }

        return;
      }

      /**
       * Determine if current node is a child of the queried component/module
       */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');

        if (options.context[COMPONENT]) {
          return this.paint(node, value, options, {
            prevNamespace: COMPONENT
          });
        }

        return;
      }

      /**
       * Key defines pseudo-state
       */
      if (key.indexOf(':') === 0) {
        if (options.state[key]) {
          return this.paint(node, value, options);
        }
      }

      if (typeof value === 'function') {
        try {
          value = value(node.style[key]);
        } catch(error) {
          return error;
        }
      }

      if (value instanceof Array) {
        node = value[0], styles = value[1];

        try {
          return this.paint(node(), styles, options);
        } catch(error) {
          return error;
        }
      }

      try {
        node.style[key] = value;
      } catch(error) {
        return error;
      }
    });
  
    const WRAPPERSTYLES = this.STYLES.wrapper || this.STYLES.group;

    if (WRAPPERSTYLES && this.SETWRAPPERSTYLES) {
      this.SETWRAPPERSTYLES(WRAPPERSTYLES);
    }
  }

  setStyleStates(prevState = this.state) {
    if (!this.REF.current) return;

    const [CURRENT, PARENT] = [this.REF.current, this.REF.current.parentNode];

    const [prevIsFirstChild, isFirstChild] = [prevState.isFirstChild, CURRENT === PARENT.firstChild];
    const [prevIsLastChild, isLastChild] = [prevState.isLastChild, CURRENT === PARENT.lastChild];

    if (prevIsFirstChild !== isFirstChild) {
      this.setState({ isFirstChild });
    }

    if (prevIsLastChild !== isLastChild) {
      this.setState({ isLastChild });
    }

    if (!this.StyleStatesApplied) {
      this.StyleStatesApplied = true;
    }
  }

  /** Event Handlers */

  handleMouseEnter(event) {
    this.props.onMouseEnter && this.props.onMouseEnter(event);

    this.setState({ isHovered: true, ':hover': true });
  }

  handleMouseLeave(event) {
    this.props.onMouseLeave && this.props.onMouseLeave(event);

    this.setState({ isHovered: false, ':hover': false });
  }

  handleFocus(event) {
    this.props.onFocus && this.props.onFocus(event);

    this.setState({ isFocused: true, ':focus': true });
  }

  handleBlur(event) {
    this.props.onBlur && this.props.onBlur(event);

    this.setState({ isFocused: false, ':focus': false });
  }

  /** Lifecycle Methods */

  componentDidMount() {   
    if (this.REF.current) {
      this.setStyleStates();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.length && JSON.stringify(this.state) === JSON.stringify(prevState)) {
      this.setStyleStates(prevState);
    }

    this.paint(this.REF.current, this.DATA, this.stylesConfig());

    Object.entries(this.ACTORMODULES).forEach(([NAMESPACE, MODIFIERS]) => {
      let { styles, config } = window[NAMESPACE]?.defaultProps;

      const state = Object.assign(...MODIFIERS.map(key => ({ [key]: true })));

      config = (typeof config === 'function') ? config(this.THEME) : config;

      this.paint(this.REF.current, styles, this.stylesConfig({ config, state }));
    });
  }

  render() {
    const { props } = this;
    const { MODIFIERGLUE, COMPONENTGLUE, SINGLECLASS, GENERATECLASSES, GENERATEDATAATTRIBUTES } = this;

    /** */
    let [CLASSES, SELECTOR, MODIFIERS] = [props.className ? props.className + ' ' : '', this.NAMESPACE, []];

    MODIFIERS.push(props.modifiers);
    MODIFIERS = MODIFIERS.concat(getModifiersFromProps(props));
    MODIFIERS = MODIFIERS.filter((item, pos) => MODIFIERS.indexOf(item) === pos);
    MODIFIERS = MODIFIERS.filter(Boolean);

    CLASSES += generateElementClasses({ NAMESPACE: SELECTOR, MODIFIERS, MODIFIERGLUE, SINGLECLASS });

    // Generate class(es) when Module also acts as another Module
    Object.entries(this.ACTORMODULES).forEach(([NAMESPACE, MODIFIERS]) => {
      CLASSES += ' ' + generateElementClasses({ NAMESPACE, MODIFIERS, MODIFIERGLUE, SINGLECLASS });
    });

    /** */
    const ATTRIBUTES = {
      ...this.getDataAttributes(props),
      ...this.getEventHandlers(props),
      ...this.getInputAttributes(props),
      ...props.attributes,

      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this),
      onFocus: this.handleFocus.bind(this),
      onBlur: this.handleBlur.bind(this),

      className: GENERATECLASSES ? CLASSES : null,
      'data-module': GENERATEDATAATTRIBUTES ? this.NAMESPACE : null
    }

    return (
      <ModuleContext.Consumer>
        {moduleContext => {
          this.DATA = this.DATA || props.styles;
          this.SETWRAPPERSTYLES = moduleContext.setWrapperStyles;
          this.CONTEXT = moduleContext;
          this.STYLES = this.getStyles(this.DATA, this.stylesConfig({ context: moduleContext }));

          const before = this.STYLES[':before'];
          const after = this.STYLES[':after'];

          /** */
          const contextValues = {
            ...moduleContext,
            ...this.state,
            ...props,

            THEME: this.THEME,
            CONFIG: this.CONFIG,

            STYLES: {
              ...moduleContext.STYLES,
              ...this.STYLES
            },

            MODIFIERGLUE, 
            COMPONENTGLUE,
            SINGLECLASS,
            GENERATECLASSES,
            GENERATEDATAATTRIBUTES,

            [this.NAMESPACE]: {
              ...this.state,
              ...props
            },

            ...(!props.permeable && { NAMESPACE: this.NAMESPACE }),

            SETWRAPPERSTYLES: this.props.setWrapperStyles
          }

          let content = (typeof props.content !== 'boolean' && props.content) || props.render || props.children;

          if (typeof content === 'function') {
            content = content({ 
              theme: this.THEME,
              utils: this.UTILS,
              config: this.CONFIG, 
              context: contextValues 
            });
          }

          return (
            <ModuleContext.Provider value={contextValues}>
              {htmlVoidElements.includes(this.TAG) ? <this.TAG id={props.id ? this.ID : null} ref={this.REF} {...ATTRIBUTES} /> : (
                <this.TAG id={props.id ? this.ID : null} ref={this.REF} {...ATTRIBUTES}>
                  {before && <Component name=':before' referer={this.NAMESPACE}>{before.content}</Component>}

                  {content}

                  {after && <Component name=':after' referer={this.NAMESPACE}>{after.content}</Component>}
                </this.TAG>
              )}
            </ModuleContext.Provider>
          );
        }}
      </ModuleContext.Consumer>
    )
  }

  /** Static Methods/Properties */

  static contextType = UIContext;
}