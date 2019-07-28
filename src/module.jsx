import React from 'react';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import mergeThemes from './utilities/mergeThemes';
import { ThemeContext } from './provider';

/** spoof env process to assist bundle size */
if (typeof process === 'undefined') window.process = { env: {} }

/** Used for generating unique module ID's */
let increment = 1;

/** Create a context object */
const ModuleContext = React.createContext({});
export { ModuleContext }

/** Render a Synergy module */
export default class Module extends React.Component {
  constructor(props, context) {
    super(props);

    this.REF = React.createRef();
    this.DATA = props.styles;

    if (window.Synergy) {
      const SYNERGY_MODULE = window[props.name] || {};
      const { config, layout } = SYNERGY_MODULE;

      if (config) this.CONFIG = config;
      if (layout) this.DATA = layout;
    }

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

  stylesConfig(theme = this.THEME, config = this.CONFIG) {
    return {
      theme,
      config,
      state: {
        ...this.state,
        ...this.props
      },
      element: this.REF.current,
      context: this.context
    }
  }

  getStyles(styles = {}, options) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      styles = styles.reduce((accumulator, item) => {
        if (!item) return accumulator;

        if (typeof item === 'function') {
          item = item(options);
        }

        Object.entries(item).forEach(entry => {
          const key = entry[0];
          const val = entry[1];
  
          if (accumulator.hasOwnProperty(key)) {
            accumulator[key] = accumulator[key] instanceof Array ? accumulator[key].concat(val) : [accumulator[key], val];
          } else {
            accumulator[key] = val;
          }
        });
  
        return accumulator;
      }, {});
    }
  
    return styles;
  }

  paint(node, styles = {}, options) {
    // console.log(this.props.name, styles);
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      return styles.forEach(style => this.paint(node, style, options));
    }
  
    Object.entries(styles).forEach(style => {
      const key = style[0];
      const value = style[1];

      if ((key === ':hover' || key === 'is-hovered') && options.state.isHovered) {
        return this.paint(node, value, options);
      }

      if (key.indexOf('with-') === 0 && options.context[key.replace('with-', '')]) {
        return this.paint(node, value, options.context[key.replace('with-', '')]);
      }

      if (key.indexOf('is-') === 0) {
        if (options[key.replace('is-', '')] || options.state && options.state[key.replace('is-', '')]) {
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

  setStyleStates() {
    if (this.REF.current === this.REF.current.parentNode.firstChild) {
      this.setState({ isFirstChild: true });
    }
    if (this.REF.current === this.REF.current.parentNode.lastChild) {
      this.setState({ isLastChild: true });
    }
    if (this.STYLES && this.STYLES[':before']) {
      this.setState({ before: this.STYLES[':before'] });
    }
    if (this.STYLES && this.STYLES[':after']) {
      this.setState({ before: this.STYLES[':after'] });
    }
  }

  /** Event Handlers */

  handleMouseEnter(event) {
    this.props.onMouseEnter && this.props.onMouseEnter(event);

    this.setState({
      isHovered: true
    });
  }

  handleMouseLeave(event) {
    this.props.onMouseLeave && this.props.onMouseLeave(event);

    this.setState({
      isHovered: false
    });
  }

  /** Lifecycle Methods */

  componentDidMount() {
    this.paint(this.REF.current, this.DATA, this.stylesConfig());
    this.setStyleStates();
  }

  componentDidUpdate(prevProps) {
    this.paint(this.REF.current, this.DATA, this.stylesConfig());

    // @TODO confirm this does what is expected
    if (prevProps.children.length !== this.props.children.length) {
      this.setStyleStates();
    }
  }

  render() {
    increment++;
  
    var Synergy = window.Synergy || {};

    const { props } = this;
    const defaults = { generateClasses: true, generateDataAttributes: true }

    /** */
    return (
      <ThemeContext.Consumer>
        {theme => {
          /** */
          this.THEME = mergeThemes(window.theme, theme, props.theme);
          // @TODO - props.config may be a function and will need evaluating (props.config(this.THEME))
          this.CONFIG = Module.config(defaults, this.CONFIG, props.config, this.THEME.modules && this.THEME.modules[props.name]);
          this.STYLES = this.getStyles(this.DATA, this.stylesConfig());

          /** */
          const MODIFIERGLUE = props.modifierGlue || this.CONFIG.modifierGlue || Synergy.modifierGlue || '--';
          const COMPONENTGLUE = props.componentGlue || this.CONFIG.componentGlue || Synergy.componentGlue || '__';
          const SINGLECLASS = props.singleClass || this.CONFIG.singleClass || false;
          const GENERATECLASSES = props.generateClasses || this.CONFIG.generateClasses;
          const GENERATEDATAATTRIBUTES = props.generateDataAttributes || this.CONFIG.generateDataAttributes;
          const ID = props.id || `module-${increment}`;
          const NAMESPACE = this.CONFIG.name || props.name || props.tag || ID;
          const TAG = (props.href && 'a') || props.component || props.tag || 'div';

          /** */
          let [CLASSES, SELECTOR, MODIFIERS] = [props.className ? props.className + ' ' : '', NAMESPACE, []];

          MODIFIERS.push(props.modifiers);
          // MODIFIERS.push(...getModifiersFromProps(props));
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
            'data-module': GENERATEDATAATTRIBUTES ? NAMESPACE : null
          }

          /** */
          const contextValues = {
            PARENT: this,

            ...this.context,
            ...this.state,
            ...props,

            THEME: this.THEME,
            CONFIG: this.CONFIG,

            STYLES: {
              ...this.context.STYLES,
              ...this.STYLES
            },

            MODIFIERGLUE, 
            COMPONENTGLUE,
            SINGLECLASS,
            GENERATECLASSES,
            GENERATEDATAATTRIBUTES,

            [NAMESPACE]: {
              ...this.state,
              ...props
            },

            NAMESPACE
          }

          return (
            <ModuleContext.Provider value={contextValues}>
              <TAG id={ID} ref={this.REF} {...ATTRIBUTES}>
                {before && <div className='before' style={before}>{before.content}</div>}

                {props.content || props.children}

                {after && <div className='after' style={after}>{after.content}</div>}
              </TAG>
            </ModuleContext.Provider>
          );
        }}
      </ThemeContext.Consumer>
    );
  }

  /** Static Methods/Properties */

  static contextType = ModuleContext;

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