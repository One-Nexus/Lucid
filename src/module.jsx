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
  constructor(props) {
    super(props);

    this.REF = React.createRef();

    this.state = {
      isHovered: false
    }
  }

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

  getStyles(styles = {}, options) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      // styles = Module.config({}, ...styles);
      styles = Module.config({}, styles.reduce((acc, item) => Object.assign(acc, item), {}));
    }
  
    return styles;
  }

  stylesConfig(theme = this.THEME, config = this.CONFIG) {
    const node = this.REF.current;
  
    return {
      theme,
      config,
      state: {
        isFirstChild: node && node === node.parentNode.firstChild,
        isLastChild: node && node === node.parentNode.lastChild,

        ...this.state,
        ...this.props
      },
      element: node,
      context: this.context
    }
  }

  paint(node, styles = {}, options) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }

    if (styles instanceof Array) {
      return styles.forEach(style => this.paint(node, style, options));
    }
  
    Object.entries(styles).forEach(style => {
      const key = style[0];
      const value = style[1];

      if (value instanceof Array) {
        node = value[0];
        styles = value[1];

        return this.paint(node(), styles, options);
      }

      if (typeof value === 'function') {
        try {
          value = value(node.style[key]);
        } catch(error) {
          return error;
        }
      }

      if (key === ':hover' && options.state.isHovered) {
        return this.paint(node, value, options);
      }

      try {
        node.style[key] = value;
      } catch(error) {
        return error;
      }
    });
  }

  /** Lifecycle Methods */

  componentDidMount() {
    if (this.STYLES) {
      this.paint(this.REF.current, this.STYLES, this.stylesConfig());
    }
  }

  componentDidUpdate() {
    if (this.STYLES) {
      this.paint(this.REF.current, this.STYLES, this.stylesConfig());
    }
  }

  render() {
    increment++;
  
    var Synergy = window.Synergy || {};

    const { props } = this;

    /** */
    return (
      <ThemeContext.Consumer>
        {theme => {
          /** */
          this.THEME = mergeThemes(window.theme, theme, props.theme);
          this.CONFIG = Module.config(
            { generateClasses: true, generateDataAttributes: true }, 
            props.config, 
            this.THEME.modules && this.THEME.modules[props.name]
          );
          this.STYLES = props.styles;

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
          const styles = this.getStyles(this.STYLES, this.stylesConfig());
          const [before, after] = [styles[':before'], styles[':after']];

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

            MODIFIERGLUE, 
            COMPONENTGLUE,
            SINGLECLASS,
            GENERATECLASSES,
            GENERATEDATAATTRIBUTES,

            [NAMESPACE]: {
              ...this.state,
              ...props
            },

            STYLES: { 
              ...this.context.STYLES, 
              ...styles
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