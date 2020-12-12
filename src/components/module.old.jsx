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

/** spoof env process to ultimately assist bundle size */
if (typeof process === 'undefined') window.process = { env: {} }

/** Used for generating unique module ID's */
let increment = 1;

/** Create a context object */
export const ModuleContext = React.createContext({});
export const MODULEContext = React.createContext({ context: {}, blueprints: {} });

/** Render a Synergy module */
export default class Module extends React.Component {
  constructor(props, context = {}) {
    super(props);

    increment++;

    var Synergy = window.Synergy || {};

    this.REF = props.host || React.createRef();
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
    this.HOSTISLUCIDELEMENT = ['React.createElement(Module', 'function Component(props)'].some(str => this.TAG.toString().includes(str));
    this.STYLES = {};

    this.state = { CHILDREN: [] };
  }

  static contextType = UIContext;

  setParentChild = child => this.setState(({ CHILDREN }) => ({ CHILDREN: [...CHILDREN, child] }));

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
      if (prop === 'group') {
        inputAttributes.name = properties[prop];
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

  paint(styles = {}, options, accumulator = {}, { prevNamespace } = {}) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      return styles.reduce((accumulator, style) => this.paint(style, options, accumulator), accumulator);
    }
  
    return Object.entries(styles).reduce((accumulator, style) => {
      const key = style[0]; let value = style[1];

      /** Determine if current node is queried modifier/state */
      if (key.indexOf('is-') === 0) {
        const CONTEXT = key.replace('is-', '');

        if (options.state.name === ':before' || options.state.name === ':after') {
          options = options.context[options.state.referer];
        }

        if (options[CONTEXT] || options.state[CONTEXT]) {
          return this.paint(value, options, accumulator);
        }

        return accumulator;
      }

      /** Determine if parent module/block is queried modifier/state */
      if (key.indexOf('$-is-') === 0 || key.indexOf('$:') === 0) {
        const MODULE = options.context.NAMESPACE;
        const CONTEXT = key.indexOf('$:') === 0 ? key.slice(1, key.length) : key.slice(5, key.length);

        if (options.context[MODULE][CONTEXT]) {
          return this.paint(value, options, accumulator);
        }

        return accumulator;
      }

      /** Determine if previously specified parent component is queried modifier/state */
      if (key.indexOf('and-is-') === 0 || key.indexOf('and:') === 0) {
        const CONTEXT = key.indexOf('and:') === 0 ? key.replace('and', '') : key.replace('and-is-', '');

        if (options.context[prevNamespace][CONTEXT]) {
          return this.paint(value, options, accumulator, { prevNamespace });
        }

        return accumulator;
      }

      /** Determine if specified parent component is queried modifier/state */
      if (key.indexOf('-is-') > -1 || key.indexOf(':') > 0) {
        const COMPONENT = key.indexOf(':') > 0 ? key.slice(0, key.indexOf(':')) : key.slice(0, key.indexOf('-is-'));
        const CONTEXT = key.indexOf(':') > 0 ? key.slice(key.indexOf(':'), key.length) : key.slice(key.indexOf('-is-') + 4, key.length);

        if (options.context[COMPONENT][CONTEXT]) {
          return this.paint(value, options, accumulator, { prevNamespace: COMPONENT });
        }

        return accumulator;
      }

      /** Determine if current node is a child of the queried component/module */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');

        if (options.context[COMPONENT]) {
          return this.paint(value, options, accumulator, { prevNamespace: COMPONENT });
        }

        return accumulator;
      }

      /** Key defines hover pseudo-state */
      if (key === 'hover') {
        if (options.state[':hover']) {
          return this.paint(value, options, accumulator);
        }

        return accumulator
      }

      /** Key defines pseudo-state */
      if (key.indexOf(':') === 0) {
        if (options.state[key]) {
          return this.paint(value, options, accumulator);
        }

        return accumulator;
      }

      const EVALUATEDKEY = /^[%*:$]/.test(key) ? key : camelCase(key);

      if (typeof value === 'function' && window.getComputedStyle(document.body).getPropertyValue(key)) {
        try {
          value = value(accumulator[EVALUATEDKEY]);
        } catch {
          value = value;
        }
      }

      if (typeof value === 'undefined' || value === null || EVALUATEDKEY === 'children') {
        return accumulator;
      }

      if (accumulator.hasOwnProperty(EVALUATEDKEY) && ['object', 'function'].some($ => typeof value === $)) {
        const PROP = accumulator[EVALUATEDKEY];

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

      return Object.assign(accumulator, { [EVALUATEDKEY]: value });
    }, accumulator);
  }

  setStyleStates(siblings = this.CONTEXT.CHILDREN || []) {
    let target = this.ID;

    if (this.NODE instanceof HTMLElement && document.body.contains(this.NODE)) {
      target = this.NODE, siblings = [...target.parentNode.childNodes];
    }

    const index = this.props.index ?? siblings.indexOf(target);
    const [isFirstChild, isLastChild] = [index === 0, index === siblings.length - 1];
    const isDisabled = this.props.disabled || target.disabled;

    if (this.state.index !== index) {
      this.setState({ index });
    }

    if (this.state.isFirstChild !== isFirstChild) {
      this.setState({ isFirstChild });
    }

    if (this.state.isLastChild !== isLastChild) {
      this.setState({ isLastChild });
    }

    if (this.state.isDisabled !== isDisabled) {
      this.setState({ isDisabled, ':disabled': isDisabled });
    }
  }

  /** Event Handlers */

  handleMouseEnter(event) {
    this.props.onMouseEnter && this.props.onMouseEnter(event);
  
    if (!this.state.isDisabled) {
      this.setState({ isHovered: true, ':hover': true });
    }
  }

  handleMouseLeave(event) {
    this.props.onMouseLeave && this.props.onMouseLeave(event);
  
    this.setState({ isHovered: false, ':hover': false });
  }

  handleFocus(event) {
    event.persist();

    this.props.onFocus && this.props.onFocus(event);

    this.setState({ isFocused: true, ':focus': true });

    const handleBlur = () => {
      this.setState({ isFocused: false, ':focus': false });

      event.target.blur();
  
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleMousedown);
    }

    const handleKeydown = ({ keyCode }) => keyCode === 9 && handleBlur();
    const handleMousedown = () => handleBlur();

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleMousedown);
  }

  /** Lifecycle Methods */

  componentDidMount() {
    if (this.REF.current instanceof HTMLElement) {
      this.NODE = this.REF.current;
    }
    // Last ditch effort to get underlying DOM node
    if (!this.NODE) {
      this.NODE = ReactDOM.findDOMNode(this.REF.current);
    }

    this.setStyleStates();
  
    if (this.NAMESPACE === 'body' && this.context.HOST) {
      if (this.context.NAMESPACE === this.context[this.NAMESPACE]?.context.NAMESPACE) {
        this.context[this.NAMESPACE].setTag(React.Fragment);
      }
    }

    if (this.CONTEXT.CHILDREN && !this.CONTEXT.CHILDREN.includes(this.ID)) {
      this.CONTEXT.SETPARENTCHILD?.(this.ID);
    }

    this.NODE && new MutationObserver(mutations => mutations.forEach(({ type, target }) => {
      if (type === 'attributes') {
        if (this.state.isDisabled !== target.disabled) {
          this.setState({ isDisabled: target.disabled, ':disabled': target.disabled });
        }

        if (target.disabled) {
          this.setState({
            isHovered: false, ':hover': false, 
            isFocused: false, ':focus': false 
          });
        }
      }
    })).observe(this.NODE, { attributes: true });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // one day my friend, you will be useful
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    this.setStyleStates();

    const WRAPPERSTYLES = this.STYLES.wrapper || this.STYLES.group;

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
          this.STYLES = this.paint(this.DATA, this.stylesConfig());

          const before = this.STYLES[':before'], after = this.STYLES[':after'];
      
          const ATTRIBUTES = {
            ...this.getDataAttributes(props),
            ...this.getEventHandlers(props),
            ...this.getInputAttributes(props),
            ...props.attributes,
      
            onMouseEnter: this.handleMouseEnter.bind(this),
            onMouseLeave: this.handleMouseLeave.bind(this),
            onFocus: this.handleFocus.bind(this),
      
            style: { ...props.style, ...this.STYLES },
            id: props.id ? props.ID : null,
            className: generateElementClasses(props, { NAMESPACE, GENERATECLASSES, MODIFIERGLUE, SINGLECLASS }),
            'data-module': GENERATEDATAATTRS ? this.NAMESPACE : null,
            
            ...(this.HOSTISLUCIDELEMENT ? { name: props.as.name || props.as } : { ref: this.REF }),

            ...((props.as || props.component) && removeLucidProps(this.props))
          }

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
            SETPARENTCHILD: this.setParentChild,
            CHILDREN: this.state.CHILDREN,

            STYLES: {
              ...this.CONTEXT.STYLES,
              ...this.STYLES
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
                    context: this.CONTEXT 
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
}