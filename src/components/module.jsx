import htmlVoidElements from 'html-void-elements';
import evalTheme from '../utilities/evalTheme';
import mergeThemes from '../utilities/mergeThemes';
import deepextend from '../utilities/deepMergeObjects';
import generateElementClasses from '../utilities/generateElementClasses';
import removeLucidProps from '../utilities/removeLucidProps';
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

    this.REF = props.hostref || React.createRef();
    this.DATA = props.styles;
    this.THEME = evalTheme(mergeThemes(context.theme, window.theme, props.theme));
    this.UTILS = context.utils || window.utils;

    const LUCIDDEFAULTS = { generateClasses: true, generateDataAttributes: true, singleClass: false } 
    const PROPCONFIG = (typeof props.config === 'function') ? props.config(this.THEME) : props.config;
    const THEMECONFIG = this.THEME.modules && this.THEME.modules[props.name];

    this.CONFIG = deepextend(LUCIDDEFAULTS, PROPCONFIG, THEMECONFIG);
    this.ID = props.id || `module-${increment}`;
    this.NAMESPACE = props.name || this.CONFIG.name || props.tag || this.ID;
    this.TAG = (props.href && 'a') || props.component || props.as || props.tag || 'div';
    this.MODIFIERGLUE = props.modifierGlue || this.CONFIG.modifierGlue || Synergy.modifierGlue || '--';
    this.COMPONENTGLUE = props.componentGlue || this.CONFIG.componentGlue || Synergy.componentGlue || '__';
    this.SINGLECLASS = props.singleClass ?? this.THEME.singleClass ?? this.CONFIG.singleClass;
    this.GENERATECLASSES = props.generateClasses ?? this.THEME.generateClasses ?? this.CONFIG.generateClasses;
    this.GENERATEDATAATTRS = props.generateDataAttributes ?? this.THEME.generateDataAttributes ?? this.CONFIG.generateDataAttributes;
  
    this.state = {}
    this.APPLY = { ...props.apply }
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
      utils,
      context: { 
        ...this.context, 
        ...context 
      },
      state: { 
        ...this.state, 
        ...this.context[this.NAMESPACE], 
        ...this.props,
        ...(this.props.modifiers?.length && Object.assign(...this.props.modifiers.map((prop) => ({ [prop]: true })))),
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

  paint(node, styles = {}, options, { prevNamespace } = {}) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      return styles.forEach(style => this.paint(node, style, options));
    }
  
    /** Cell Query */
    Object.entries(styles).forEach(style => {
      const key = style[0]; let value = style[1];

      /** Determine if current node is queried modifier/state */
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

      /**  Determine if parent module/block is queried modifier/state */
      if (key.indexOf('$-is-') === 0 || key.indexOf('$:') === 0) {
        const MODULE = options.context.NAMESPACE;
        const CONTEXT = key.indexOf('$:') === 0 ? key.slice(1, key.length) : key.slice(5, key.length);

        if (options.context[MODULE][CONTEXT]) {
          return this.paint(node, value, options);
        }

        return;
      }

      /** Determine if previously specified parent component is queried modifier/state */
      if (key.indexOf('and-is-') === 0 || key.indexOf('and:') === 0) {
        const CONTEXT = key.indexOf('and:') === 0 ? key.replace('and', '') : key.replace('and-is-', '');

        if (options.context[prevNamespace][CONTEXT]) {
          return this.paint(node, value, options, { prevNamespace });
        }

        return;
      }

      /** Determine if specified parent component is queried modifier/state */
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

      /** Determine if current node is a child of the queried component/module */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');

        if (options.context[COMPONENT]) {
          return this.paint(node, value, options, {
            prevNamespace: COMPONENT
          });
        }

        return;
      }

      /** Key defines pseudo-state */
      if (key === 'hover') {
        if (options.state[':hover']) {
          return this.paint(node, value, options);
        }
      }

      if (key.indexOf(':') === 0) {
        if (options.state[key]) {
          return this.paint(node, value, options);
        }
      }

      // @TODO - revist this feature (and the correspnding docs)
      // if (value instanceof Array) {
      //   node = value[0], styles = value[1];

      //   try {
      //     return this.paint(node(), styles, options);
      //   } catch(error) {
      //     return error;
      //   }
      // }

      if (typeof value === 'function' && window.getComputedStyle(node).getPropertyValue(key)) {
        try {
          value = value(node.style[key]);
        } catch(error) {
          return error;
        }
      }

      node.style[key] = value;
    });
  
    const WRAPPERSTYLES = this.STYLES.wrapper || this.STYLES.group;

    if (WRAPPERSTYLES && this.SETWRAPPERSTYLES) {
      this.SETWRAPPERSTYLES(WRAPPERSTYLES);
    }
  }

  setStyleStates(prevState = this.state) {
    if (!this.REF.current) return;

    const NODE = this.REF.current;

    const [prevIsFirstChild, isFirstChild] = [prevState.isFirstChild, NODE === NODE.parentNode.firstChild];
    const [prevIsLastChild, isLastChild] = [prevState.isLastChild, NODE === NODE.parentNode.lastChild];

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

    Object.values(this.APPLY).forEach(({ styles, config }) => {
      this.paint(this.REF.current, styles, this.stylesConfig({ config }));
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.as) {
      return false;
    }

    return true;
  }

  render() {
    const { props } = this;
    const { NAMESPACE, MODIFIERGLUE, COMPONENTGLUE, SINGLECLASS, GENERATECLASSES, GENERATEDATAATTRS } = this;

    const ATTRIBUTES = {
      ...this.getDataAttributes(props),
      ...this.getEventHandlers(props),
      ...this.getInputAttributes(props),
      ...props.attributes,

      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this),
      onFocus: this.handleFocus.bind(this),
      onBlur: this.handleBlur.bind(this),

      id: props.id ? this.ID : null,
      className: generateElementClasses(props, { NAMESPACE, GENERATECLASSES, MODIFIERGLUE, SINGLECLASS }),
      'data-module': GENERATEDATAATTRS ? this.NAMESPACE : null,

      ...(typeof this.TAG === 'function' || props.as ? {
        name: props.as.name || props.as,
        apply: this.APPLY,
        hostref: this.REF,
        
        ...removeLucidProps(this.props)
      } : {
        ref: this.REF
      })
    }

    return (
      <ModuleContext.Consumer>
        {moduleContext => {
          this.DATA = this.DATA || props.styles;
          this.SETWRAPPERSTYLES = moduleContext.setWrapperStyles;
          this.CONTEXT = moduleContext;
          this.STYLES = this.getStyles(this.DATA, this.stylesConfig({ context: moduleContext }));
          this.APPLY[this.NAMESPACE] = this.APPLY[this.NAMESPACE] || {  styles: this.DATA, config: this.CONFIG }

          if (this.REF.current && !props.apply) {
            // for some reason, componentDidUpdate() does not get called after this
            // render, so we must apply the updated styles manually during render
            this.paint(this.REF.current, this.DATA, this.stylesConfig());
          }

          const before = this.STYLES[':before'], after = this.STYLES[':after'];

          /** */
          const contextValues = {
            ...moduleContext,

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
            GENERATEDATAATTRS,

            ...(!props.permeable && { 
              NAMESPACE: typeof props.as === 'string' ? this.CONTEXT.NAMESPACE : this.NAMESPACE 
            }),

            SETWRAPPERSTYLES: this.props.setWrapperStyles,

            [this.NAMESPACE]: {
              ...props,
              ...this.state
            }
          }

          const CONTENT = (typeof props.content !== 'boolean' && props.content) || props.render || props.children;

          return (
            <ModuleContext.Provider value={contextValues}>
              {htmlVoidElements.includes(props.tag) ? <this.TAG {...ATTRIBUTES} /> : (
                <this.TAG {...ATTRIBUTES}>
                  {before && <Component name=':before' referer={this.NAMESPACE}>{before.content}</Component>}

                  {typeof CONTENT === 'function' ? CONTENT({ 
                    theme: this.THEME,
                    utils: this.UTILS,
                    config: this.CONFIG, 
                    context: contextValues 
                  }) : CONTENT}

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