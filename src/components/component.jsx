import htmlVoidElements from 'html-void-elements';
import generateElementClasses from '../utilities/generateElementClasses';
import Module, { ModuleContext } from './module.jsx';

if (typeof React === 'undefined') {
  var React = require('react');
}

/** Render a Synergy component */
export default class Component extends Module {
  constructor(props) {
    super(props);

    this.state = { tag: this.TAG, setTag: this.setTag }
  }

  setTag = tag => this.setState({ tag });

  render() {
    this.DATA = this.context.STYLES[this.NAMESPACE];
    this.SETWRAPPERSTYLES = this.context.setWrapperStyles;
    this.APPLY[this.NAMESPACE] = this.APPLY[this.NAMESPACE] || { styles: this.DATA, config: this.CONFIG }

    this.STYLES = this.StyleStatesApplied ? this.getStyles(this.DATA, this.stylesConfig({ 
      theme: this.context.THEME, config: this.context.CONFIG
    })) : {};
      
    const before = this.STYLES[':before'], after = this.STYLES[':after'];
    const props = { ...this.context[this.context.NAMESPACE][this.NAMESPACE], ...this.props };
    const { MODIFIERGLUE, COMPONENTGLUE, SINGLECLASS, GENERATECLASSES } = this.context;
    const STRICT_NAMESPACE = (props.subComponent ? this.context.STRICT_NAMESPACE : this.context.NAMESPACE) + COMPONENTGLUE + this.NAMESPACE;
    const SELECTOR = props.subComponent ? STRICT_NAMESPACE : this.context.NAMESPACE + COMPONENTGLUE + this.NAMESPACE;

    const ATTRIBUTES = this.NAMESPACE === 'body' && this.state.tag === React.Fragment ? {} : {
      ...this.getDataAttributes(props),
      ...this.getEventHandlers(props),
      ...this.getInputAttributes(props),
      ...props.attributes,

      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this),
      onFocus: this.handleFocus.bind(this),
      onBlur: this.handleBlur.bind(this),
      ref: this.REF,
      // ref: foo => ({ current: 'hi '}),

      className: generateElementClasses(this.props, { NAMESPACE: SELECTOR, GENERATECLASSES, MODIFIERGLUE, SINGLECLASS }),
      'data-component': this.context.GENERATEDATAATTRS ? this.NAMESPACE : null,
      'data-sub-component': this.context.GENERATEDATAATTRS ? props.subComponent : null
    }

    const contextValues = {
      ...this.context,

      [this.NAMESPACE]: {
        ...props,
        ...this.state,

        state: {
          ...props,
          ...this.state
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
        {htmlVoidElements.includes(props.TAG) ? <this.state.TAG {...ATTRIBUTES} /> : (
          <this.state.tag {...ATTRIBUTES}>
            {before && <Component name=':before' referer={this.NAMESPACE}>{before.content}</Component>}

            {props.content || props.children}

            {after && <Component name=':after' referer={this.NAMESPACE}>{after.content}</Component>}
          </this.state.tag>
        )}
      </ModuleContext.Provider>
    );
  }

  static contextType = ModuleContext;
}

export const SubComponent = (props) => (
  <Component subComponent={true} {...props}>{props.children}</Component>
);