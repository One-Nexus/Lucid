import htmlVoidElements from 'html-void-elements';
import getModifiersFromProps from '../utilities/getModifiersFromProps';
import generateElementClasses from '../utilities/generateElementClasses';
import Module, { ModuleContext } from './module.jsx';

if (typeof React === 'undefined') {
  var React = require('react');
}

/**
 * Render a Synergy component
 */
export default class Component extends Module {
  constructor(props) {
    super(props);

    this.REF = React.createRef();
    this.NAMESPACE = props.name || props.tag;
  }

  render() {
    /** */
    this.DATA = this.context.STYLES[this.NAMESPACE];
    this.SETWRAPPERSTYLES = this.context.setWrapperStyles;

    let before, after;

    if (this.StyleStatesApplied) {
      this.STYLES = this.getStyles(this.DATA, this.stylesConfig({ 
        theme: this.context.THEME, 
        config: this.context.CONFIG
      }));
      
      before = this.STYLES[':before'];
      after = this.STYLES[':after'];
    }

    this.apply[this.NAMESPACE] = this.apply[this.NAMESPACE] || {
      styles: this.DATA,
      config: this.CONFIG
    };

    const props = { ...this.context[this.NAMESPACE], ...this.props };
    const { MODIFIERGLUE, COMPONENTGLUE, SINGLECLASS } = this.context;
    const TAG = (props.href && 'a') || props.component || props.tag || 'div';
    const STRICT_NAMESPACE = (props.subComponent ? this.context.STRICT_NAMESPACE : this.context.NAMESPACE) + COMPONENTGLUE + this.NAMESPACE;

    /** */
    let [CLASSES, MODIFIERS] = [props.className ? props.className + ' ' : '', []];
    let SELECTOR = props.subComponent ? STRICT_NAMESPACE : this.context.NAMESPACE + COMPONENTGLUE + this.NAMESPACE;

    props.modifiers && MODIFIERS.push(...props.modifiers);
    MODIFIERS = MODIFIERS.concat(getModifiersFromProps(props));
    MODIFIERS = MODIFIERS.filter((item, pos) => MODIFIERS.indexOf(item) === pos);
    MODIFIERS = MODIFIERS.filter(Boolean);

    CLASSES += generateElementClasses({ NAMESPACE: SELECTOR, MODIFIERS, MODIFIERGLUE, SINGLECLASS });

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

      className: this.context.GENERATECLASSES ? CLASSES : null,
      'data-component': this.context.GENERATEDATAATTRIBUTES ? this.NAMESPACE : null,
      'data-sub-component': this.context.GENERATEDATAATTRIBUTES ? props.subComponent : null
    }

    /** */
    const contextValues = {
      ...this.context,

      [this.NAMESPACE]: {
        ...this.state,
        ...props,

        state: {
          ...this.state,
          ...props,
        },

        context: this.context
      },

      STYLES: { 
        ...this.context.STYLES, 
        ...this.STYLES
      },

      STRICT_NAMESPACE
    }

    return (
      <ModuleContext.Provider value={contextValues}>
        {htmlVoidElements.includes(TAG) ? <TAG ref={this.REF} {...ATTRIBUTES} /> : (
          <TAG ref={this.REF} {...ATTRIBUTES}>
            {before && <Component name=':before' referer={this.NAMESPACE}>{before.content}</Component>}

            {props.content || props.children}

            {after && <Component name=':after' referer={this.NAMESPACE}>{after.content}</Component>}
          </TAG>
        )}
      </ModuleContext.Provider>
    );
  }

  static contextType = ModuleContext;
}

export const SubComponent = (props) => (
  <Component subComponent={true} {...props}>{props.children}</Component>
);