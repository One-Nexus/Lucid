import { findDOMNode } from 'react-dom';
import htmlVoidElements from 'html-void-elements';
import evalTheme from '../utilities/evalTheme';
import mergeThemes from '../utilities/mergeThemes';
import deepextend from '../utilities/deepMergeObjects';
import generateElementClasses from '../utilities/generateElementClasses';
import camelCase from 'camelcase';
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

    this.REF = React.createRef();
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
    this.HASHOSTLUCIDMODULE = ['React.createElement(Module', 'function Component(props)'].some(str => this.TAG.toString().includes(str));

    this.FOO = {};
    this.state = { CHILDREN: [] };
    this.CHILDREN = [];
  }

  setParentChild = child => {
    this.CHILDREN = [...this.CHILDREN, child];
    this.setState({ CHILDREN: this.CHILDREN });
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

  stylesConfig({ theme = this.THEME, config = this.CONFIG, context = this.CONTEXT, utils = this.UTILS } = {}) {
    return {
      theme,
      config,
      utils,
      context,
      state: { 
        ...this.state, 
        ...this.context[this.NAMESPACE], 
        ...this.props,
        ...(this.props.modifiers?.length && Object.assign(...this.props.modifiers.map((prop) => ({ [prop]: true })))),
      }
    }
  }

  paint(styles = {}, options, { prevNamespace } = {}) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      return styles.forEach(style => this.paint(style, options));
    }
  
    Object.entries(styles).forEach(style => {
      const key = style[0]; let value = style[1];

      /** Determine if current node is queried modifier/state */
      if (key.indexOf('is-') === 0) {
        const CONTEXT = key.replace('is-', '');

        if (options.state.name === ':before' || options.state.name === ':after') {
          options = options.context[options.state.referer];
        }

        if (options[CONTEXT] || options.state[CONTEXT]) {
          return this.paint(value, options);
        }

        return;
      }

      /** Determine if parent module/block is queried modifier/state */
      if (key.indexOf('$-is-') === 0 || key.indexOf('$:') === 0) {
        const MODULE = options.context.NAMESPACE;
        const CONTEXT = key.indexOf('$:') === 0 ? key.slice(1, key.length) : key.slice(5, key.length);

        if (options.context[MODULE][CONTEXT]) {
          return this.paint(value, options);
        }

        return;
      }

      /** Determine if previously specified parent component is queried modifier/state */
      if (key.indexOf('and-is-') === 0 || key.indexOf('and:') === 0) {
        const CONTEXT = key.indexOf('and:') === 0 ? key.replace('and', '') : key.replace('and-is-', '');

        if (options.context[prevNamespace][CONTEXT]) {
          return this.paint(value, options, { prevNamespace });
        }

        return;
      }

      /** Determine if specified parent component is queried modifier/state */
      if (key.indexOf('-is-') > -1 || key.indexOf(':') > 0) {
        const COMPONENT = key.indexOf(':') > 0 ? key.slice(0, key.indexOf(':')) : key.slice(0, key.indexOf('-is-'));
        const CONTEXT = key.indexOf(':') > 0 ? key.slice(key.indexOf(':'), key.length) : key.slice(key.indexOf('-is-') + 4, key.length);

        if (options.context[COMPONENT][CONTEXT]) {
          return this.paint(value, options, { prevNamespace: COMPONENT });
        }

        return;
      }

      /** Determine if current node is a child of the queried component/module */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');

        if (options.context[COMPONENT]) {
          return this.paint(value, options, { prevNamespace: COMPONENT });
        }

        return;
      }

      /** Key defines hover pseudo-state */
      if (key === 'hover') {
        if (options.state[':hover']) {
          return this.paint(value, options);
        }
      }

      /** Key defines pseudo-state */
      if (key.indexOf(':') === 0) {
        if (options.state[key]) {
          return this.paint(value, options);
        }
      }

      const EVALUATEDKEY = /^[%*:$]/.test(key) ? key : camelCase(key);

      if (typeof value === 'function' && window.getComputedStyle(document.body).getPropertyValue(key)) {
        try {
          value = value(this.FOO[EVALUATEDKEY]);
        } catch {
          value = value;
        }
        // value = value(this.FOO[key]);
      }

      if (typeof value === 'undefined' || value === null || EVALUATEDKEY === 'children') {
        return;
      }

      if (this.FOO.hasOwnProperty(EVALUATEDKEY) && ['object', 'function'].some($ => typeof value === $)) {
        const PROP = this.FOO[EVALUATEDKEY];

        if (PROP instanceof Array) {
          if (typeof value === 'function') {
            value = PROP.some($ => $.toString() === value.toString()) ? PROP : PROP.concat(value);
          } else {
            value = PROP.includes(value) ? PROP : PROP.concat(value);
          }
        } else if (PROP !== value) {
          if (!(typeof value === 'function' && PROP.toString() === value.toString())) {
            value = [PROP, value];
          }
        }
      }

      this.FOO = { ...this.FOO, [EVALUATEDKEY]: value };
    });
  }

  setStyleStates(siblings = this.CONTEXT.CHILDREN) {
    console.log(siblings);

    const INDEX = ~siblings.indexOf(this.ID) ? siblings.indexOf(this.ID) : this.props.index;
    const [isFirstChild, isLastChild] = [INDEX === 0, INDEX === siblings.length - 1];

    if (this.state.isFirstChild !== isFirstChild) {
      this.setState({ isFirstChild });
    }

    if (this.state.isLastChild !== isLastChild) {
      this.setState({ isLastChild });
    }

    if (this.state.index !== INDEX) {
      this.setState({ index: INDEX });
    }
  }

  /** Event Handlers */

  handleMouseEnter(event) {
    // if (!this.NODE || this.NODE.disabled) {
    //   return;
    // }
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
    if (this.NAMESPACE === 'body' && this.context.HOST) {
      if (this.context.NAMESPACE === this.context[this.NAMESPACE]?.context.NAMESPACE) {
        this.context[this.NAMESPACE].setTag(React.Fragment);
      }
    }

    this.CONTEXT.CHILDREN && this.setStyleStates();

    if (this.CONTEXT.CHILDREN && !this.CONTEXT.CHILDREN.includes(this.ID)) {
      this.CONTEXT.setParentChild?.(this.ID);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.length && JSON.stringify(this.state) === JSON.stringify(prevState)) {
      this.CONTEXT.CHILDREN && this.setStyleStates();
    }

    const WRAPPERSTYLES = this.FOO.wrapper || this.FOO.group;

    if (WRAPPERSTYLES && this.SETWRAPPERSTYLES) {
      this.SETWRAPPERSTYLES(WRAPPERSTYLES);
    }
  }

  render() {
    const { props } = this;
    const { NAMESPACE, MODIFIERGLUE, COMPONENTGLUE, SINGLECLASS, GENERATECLASSES, GENERATEDATAATTRS } = this;

    return (
      <ModuleContext.Consumer>
        {moduleContext => {
          this.CONTEXT = { ...this.context, ...moduleContext };
          this.DATA = this.DATA || props.styles;
          this.SETWRAPPERSTYLES = moduleContext.SETWRAPPERSTYLES;
  
          this.paint(this.DATA, this.stylesConfig());

          const before = this.FOO[':before'], after = this.FOO[':after'];
      
          const ATTRIBUTES = {
            ...this.getDataAttributes(props),
            ...this.getEventHandlers(props),
            ...this.getInputAttributes(props),
            ...props.attributes,
      
            onMouseEnter: this.handleMouseEnter.bind(this),
            onMouseLeave: this.handleMouseLeave.bind(this),
            onFocus: this.handleFocus.bind(this),
            onBlur: this.handleBlur.bind(this),
      
            style: { ...props.style, ...this.FOO },
            id: this.ID,
            className: generateElementClasses(props, { NAMESPACE, GENERATECLASSES, MODIFIERGLUE, SINGLECLASS }),
            'data-module': GENERATEDATAATTRS ? this.NAMESPACE : null,
            
            ...(this.HASHOSTLUCIDMODULE && {
              name: props.as.name || props.as,
              ...removeLucidProps(this.props)
            })
          }

          /** */
          const contextValues = {
            ...this.CONTEXT,

            THEME: this.THEME,
            CONFIG: this.CONFIG,

            MODIFIERGLUE, 
            COMPONENTGLUE,
            SINGLECLASS,
            GENERATECLASSES,
            GENERATEDATAATTRS,

            SETWRAPPERSTYLES: this.props.setWrapperStyles,
            setParentChild: this.setParentChild.bind(this),
            CHILDREN: this.state.CHILDREN,

            STYLES: {
              ...this.CONTEXT.STYLES,
              ...this.FOO
            },

            [this.NAMESPACE]: {
              ...props,
              ...this.state
            },

            ...(!props.permeable && { 
              NAMESPACE: typeof props.as === 'string' ? this.CONTEXT.NAMESPACE : this.NAMESPACE 
            }),

            ...(props.as && { HOST: props.as })
          }

          let CONTENT = (typeof props.content !== 'boolean' && props.content) || props.render || props.children;

          // IDK WTF this is required to cause children (in some given context) to re-render...
          // ...re-rendering should be triggered when the above contextValues changes and is
          // passed to <ModuleContext.Provider>, given that the children subscribe to this context
          if (props.children) CONTENT = React.Children.map(CONTENT, (child => {
            return React.isValidElement(child) ? React.cloneElement(child) : child;
          }));

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