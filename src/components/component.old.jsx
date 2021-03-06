import htmlVoidElements from 'html-void-elements';
import generateElementClasses from '../utilities/generateElementClasses';
import removeLucidProps from '../utilities/removeLucidProps';
import Module, { ModuleContext } from './module.jsx';

if (typeof React === 'undefined') {
  var React = require('react');
}

/** Render a Synergy component */
export default class Component extends Module {
  constructor(props) {
    super(props);

    this.state = { CHILDREN: [], tag: this.TAG, setTag: this.setTag }
  }

  static contextType = ModuleContext;

  setTag = tag => this.setState({ tag });

  render() {
    this.CONTEXT = this.context;
    this.DATA = this.context.STYLES[this.NAMESPACE];
    this.SETWRAPPERSTYLES = this.context.setWrapperStyles;
    this.STYLES = this.paint(this.DATA, this.stylesConfig());
      
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

      style: { ...props.style, ...this.STYLES },
      id: props.id ? props.id : null,
      className: generateElementClasses(this.props, { NAMESPACE: SELECTOR, GENERATECLASSES, MODIFIERGLUE, SINGLECLASS }),
      'data-component': this.context.GENERATEDATAATTRS ? this.NAMESPACE : null,
      'data-sub-component': this.context.GENERATEDATAATTRS ? props.subComponent : null,

      ...(!this.HOSTISLUCIDELEMENT && { ref: this.REF }),

      ...((props.as || props.component) && removeLucidProps(this.props))
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

      SETPARENTCHILD: this.setParentChild,
      CHILDREN: this.state.CHILDREN,

      STRICT_NAMESPACE
    }
  
    return (
      <ModuleContext.Provider value={contextValues}>
        {htmlVoidElements.includes(props.tag) ? <this.state.tag {...ATTRIBUTES} /> : (
          <this.state.tag {...ATTRIBUTES}>
            {before && <Component name=':before' referer={this.NAMESPACE}>{before.content}</Component>}

            {props.content || props.children}

            {after && <Component name=':after' referer={this.NAMESPACE}>{after.content}</Component>}
          </this.state.tag>
        )}
      </ModuleContext.Provider>
    );
  }
}

export const SubComponent = (props) => (
  <Component subComponent={true} {...props}>{props.children}</Component>
);