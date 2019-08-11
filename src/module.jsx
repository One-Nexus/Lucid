import React from 'react';
import evalConfig from './utilities/evalConfig';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import mergeThemes from './utilities/mergeThemes';
import { ThemeContext } from './provider';

/** spoof env process to assist bundle size */
if (typeof process === 'undefined') window.process = { env: {} }

/** Used for generating unique module ID's */
let increment = 1;

/** Create a context object */
export const ModuleContext = React.createContext({});

/** Render a Synergy module */
export default class Module extends React.Component {
  constructor(props, context) {
    super(props);

    increment++;

    var Synergy = window.Synergy || {};

    this.REF = React.createRef();
    this.DATA = props.styles;
    this.THEME = mergeThemes(context, window.theme, props.theme);

    const LUCIDDEFAULTS = { generateClasses: true, generateDataAttributes: true }
    const THEMECONFIG = this.THEME.modules && evalConfig(this.THEME.modules[props.name]);

    let DEFAULTS = props.config;

    if (window.Synergy) {
      const SYNERGY_MODULE = window[props.name] || {};
      const { config, styles } = SYNERGY_MODULE;

      if (config) DEFAULTS = config;
      if (styles) this.DATA = styles;
    }

    DEFAULTS = (typeof DEFAULTS === 'function') ? DEFAULTS(this.THEME) : DEFAULTS;

    this.CONFIG = Module.config(LUCIDDEFAULTS, DEFAULTS, THEMECONFIG);
    this.ID = props.id || `module-${increment}`;
    this.NAMESPACE = this.CONFIG.name || props.name || props.tag || this.ID;
    this.TAG = (props.href && 'a') || props.component || props.tag || 'div';
    this.MODIFIERGLUE = props.modifierGlue || this.CONFIG.modifierGlue || Synergy.modifierGlue || '--';
    this.COMPONENTGLUE = props.componentGlue || this.CONFIG.componentGlue || Synergy.componentGlue || '__';
    this.SINGLECLASS = props.singleClass || this.CONFIG.singleClass || false;
    this.GENERATECLASSES = props.generateClasses || this.CONFIG.generateClasses;
    this.GENERATEDATAATTRIBUTES = props.generateDataAttributes || this.CONFIG.generateDataAttributes;

    this.state = {
      isHovered: false,
      isFirstChild: false,
      isLastChild: false,
      before: null,
      after: null
    }
  }

  /** Get Attributes */

  getEventHandlers(properties) {
    let eventHandlers = {};

    for (let prop in properties) {
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

  getDataAttributes(properties) {
    let dataAttributes = {};

    for (let prop in properties) {
      if (prop.indexOf('data-') === 0) {
        dataAttributes[prop] = properties[prop];
      }
    }

    return dataAttributes;
  }

  /** Styling */

  stylesConfig({ theme = this.THEME, config = this.CONFIG, context = this.context } = {}) {
    return {
      theme,
      config,
      context,
      state: {
        ...this.state,
        ...this.props
      },
      element: this.REF.current
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

  paint(node, styles = {}, options) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      return styles.forEach(style => this.paint(node, style, options));
    }
  
    Object.entries(styles).forEach(style => {
      const key = style[0]; const value = style[1];

      if ((key === ':hover' || key === 'is-hovered') && options.state.isHovered) {
        return this.paint(node, value, options);
      }

      if (key.indexOf('with-') === 0 && options.context[key.replace('with-', '')]) {
        return this.paint(node, value, options.context[key.replace('with-', '')]);
      }

      if (key.indexOf('is-') === 0) {
        if (options[key.replace('is-', '')] || options.state[key.replace('is-', '')]) {
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
  }

  setStyleStates(prevState = this.state) {
    const [CURRENT, PARENT] = [this.REF.current, this.REF.current.parentNode];

    const [prevIsFirstChild, isFirstChild] = [prevState.isFirstChild, CURRENT === PARENT.firstChild];
    const [prevIsLastChild, isLastChild] = [prevState.isLastChild, CURRENT === PARENT.lastChild];
    const [prevBefore, before] = [prevState.before, this.STYLES[':before']];
    const [prevAfter, after] = [prevState.after, this.STYLES[':after']];

    if (prevIsFirstChild !== isFirstChild) {
      this.setState({ isFirstChild });
    }

    if (prevIsLastChild !== isLastChild) {
      this.setState({ isLastChild });
    }

    if (JSON.stringify(prevBefore) !== JSON.stringify(before)) {
      this.setState({ before });
    }

    if (JSON.stringify(prevAfter) !== JSON.stringify(after)) {
      this.setState({ after });
    }
  }

  /** Event Handlers */

  handleMouseEnter(event) {
    this.props.onMouseEnter && this.props.onMouseEnter(event);

    this.setState({ isHovered: true });
  }

  handleMouseLeave(event) {
    this.props.onMouseLeave && this.props.onMouseLeave(event);

    this.setState({ isHovered: false });
  }

  /** Lifecycle Methods */

  componentDidMount() {
    if (this.REF.current) {
      this.setStyleStates();
      this.paint(this.REF.current, this.DATA, this.stylesConfig());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.setStyleStates(prevState);
    this.paint(this.REF.current, this.DATA, this.stylesConfig());
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

    if (SINGLECLASS) {
      SELECTOR += MODIFIERS.length ? MODIFIERGLUE + MODIFIERS.join(MODIFIERGLUE) : '';
    } else {
      MODIFIERS.forEach(MODIFIER => CLASSES += SELECTOR + MODIFIERGLUE + MODIFIER + ' ');
    }

    CLASSES += SELECTOR;

    /** */
    const { before, after } = this.state;

    const ATTRIBUTES = {
      ...this.getDataAttributes(props),
      ...this.getEventHandlers(props),
      ...props.attributes,

      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this),

      className: GENERATECLASSES ? CLASSES : null,
      'data-module': GENERATEDATAATTRIBUTES ? this.NAMESPACE : null
    }

    return (
      <ModuleContext.Consumer>
        {moduleContext => {
          this.STYLES = this.getStyles(this.DATA, this.stylesConfig({ context: moduleContext }));

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

            NAMESPACE: this.NAMESPACE
          }

          let content = props.content || props.children;

          if (typeof content === 'function') {
            content = content({ 
              theme: this.THEME, 
              config: this.CONFIG, 
              context: contextValues 
            });
          }

          return (
            <ModuleContext.Provider value={contextValues}>
              <this.TAG id={props.id ? this.ID : null} ref={this.REF} {...ATTRIBUTES}>
                {before && <Component name=':before'>{before.content}</Component>}

                {content}

                {after && <Component name=':after'>{after.content}</Component>}
              </this.TAG>
            </ModuleContext.Provider>
          );
        }}
      </ModuleContext.Consumer>
    )
  } 

  /** Static Methods/Properties */

  static contextType = ThemeContext;

  static config = (...params) => {
    if (process.env.SYNERGY) {
      return Synergy.config(...params);
    } 
    else if (typeof Synergy !== 'undefined' && typeof Synergy.config === 'function') {
      return Synergy.config(...params);
    } 
    else {
      return require('deep-extend')(...params);
    }
  }
}

export class Wrapper extends Module {
  render() {
    let MODULE = this.props.module;

    const NAMESPACE = this.props.name || 'wrapper';

    if (!MODULE) {
      if (this.props.children.length) {
        MODULE = this.props.children[0].type.name.toLowerCase();
      } else {
        MODULE = this.props.children.type.name.toLowerCase();
      }
    }

    const DYNAMICPROPS = {
      [MODULE]: true
    }

    return (
      <Module name={NAMESPACE} {...DYNAMICPROPS} {...this.props}>
        {this.props.children}
      </Module>
    );
  }
}

export class Group extends Module {
  render() {
    return (
      <Wrapper name='group' {...this.props}>{this.props.children}</Wrapper>
    );
  }
}