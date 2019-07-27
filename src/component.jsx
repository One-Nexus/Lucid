import React from 'react';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import Module, { ModuleContext } from './module.jsx';

/**
 * Render a Synergy component
 */
export default class Component extends Module {
  componentDidMount() {
    if (this.context.STYLES) {
      // console.log(this.REF.current, this.stylesConfig())
      this.paint(this.REF.current, this.context.STYLES[this.NAMESPACE], this.stylesConfig());
    }
  }

  componentDidUpdate() {
    if (this.context.STYLES) {
      this.paint(this.REF.current, this.context.STYLES[this.NAMESPACE], this.stylesConfig());
    }
  }

  render() {
    /** */
    const { props } = this;
    const { MODIFIERGLUE, COMPONENTGLUE } = this.context;

    this.NAMESPACE = props.name || props.tag;

    const STRICT_NAMESPACE = (this.context.STRICT_NAMESPACE || this.context.NAMESPACE) + COMPONENTGLUE + this.NAMESPACE;
    const TAG = (props.href && 'a') || props.component || props.tag || 'div';

    /** */
    let [CLASSES, MODIFIERS] = [props.className ? props.className + ' ' : '', []];
    let SELECTOR = props.subComponent ? STRICT_NAMESPACE : this.context.NAMESPACE + COMPONENTGLUE + this.NAMESPACE;

    MODIFIERS.push(props.modifiers);
    // MODIFIERS.push(...getModifiersFromProps(props));
    MODIFIERS = MODIFIERS.concat(getModifiersFromProps(props));
    MODIFIERS = MODIFIERS.filter((item, pos) => MODIFIERS.indexOf(item) === pos);
    MODIFIERS = MODIFIERS.filter(Boolean);

    if (this.context.SINGLECLASS) {
      SELECTOR += MODIFIERS.length ? MODIFIERGLUE + MODIFIERS.join(MODIFIERGLUE) : '';
    } else {
      MODIFIERS.forEach(MODIFIER => CLASSES += SELECTOR + MODIFIERGLUE + MODIFIER + ' ');
    }

    CLASSES += SELECTOR;

    /** */
    const styles = this.getStyles(this.context.STYLES[this.NAMESPACE], this.stylesConfig());
    const [before, after] = [styles[':before'], styles[':after']];

    const ATTRIBUTES = {
      ...this.getDataAttributes(props),
      ...this.getEventHandlers(props),
      ...props.attributes,

      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this),

      className: this.context.GENERATECLASSES ? CLASSES : null,
      'data-component': this.context.GENERATEDATAATTRIBUTES ? this.NAMESPACE : null,
      'data-sub-component': this.context.GENERATEDATAATTRIBUTES ? props.subComponent : null
    }

    // console.log(this.state);

    /** */
    const contextValues = { 
      ...this.context,
      ...this.state,
      ...props,

      [this.NAMESPACE]: {
        ...this.state,
        ...props
      },

      STYLES: { 
        ...this.context.STYLES, 
        ...styles
      },

      STRICT_NAMESPACE
    }

    return (
      <ModuleContext.Provider value={contextValues}>
        <TAG ref={this.REF} {...ATTRIBUTES}>
          {before && <div className='before' style={before}>{before.content}</div>}

          {props.content || props.children}

          {after && <div className='after' style={after}>{after.content}</div>}
        </TAG>
      </ModuleContext.Provider>
    );
  }

  static contextType = ModuleContext;
}

export const SubComponent = props => (
  <Component subComponent={true} {...props}>{props.children}</Component>
);