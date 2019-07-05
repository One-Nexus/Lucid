import React from 'react';
import Module, { ModuleContext } from './module.jsx';
import Polymorph, { paint } from './react-polymorph';

/**
 * Render a Synergy component
 */
export default class Component extends Module {
  stylesConfig() {
    const node = this.REF.current;
  
    return {
      theme: this.context.THEME,
      config: this.context.CONFIG,
      state: {
        isFirstChild: node && node === node.parentNode.firstChild,
        isLastChild : node && node === node.parentNode.lastChild,
        previousSibling: node && node.previousSibling,
        nextSibling: node && node.nextSibling,

        ...this.state, 
        ...this.props 
      },
      context: this.context
    }
  }

  contextStyles() {
    return Polymorph(this.context.STYLES[this.props.name], this.stylesConfig());
  }

  componentDidMount() {
    if (this.context.STYLES) {
      paint(this.REF.current, this.context.STYLES[this.props.name], this.stylesConfig());
    }
  }

  componentDidUpdate() {
    if (this.context.STYLES) {
      paint(this.REF.current, this.context.STYLES[this.props.name], this.stylesConfig());
    }
  }

  static contextType = ModuleContext;

  render() {
    const { props } = this;
    const { MODIFIERGLUE, COMPONENTGLUE }  = this.context;

    const Tag = (props.href && 'a') || props.component || props.tag || 'div';
    const classNames = this.context.NAMESPACE + COMPONENTGLUE + props.name;

    const rest = {
      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this)
    }

    const contextValues = { 
      ...this.context, 
      ...props,

      STYLES: { ...this.context.STYLES, ...this.contextStyles() }
    }

    return (
      <ModuleContext.Provider value={contextValues}>
        <Tag className={classNames} data-component={props.name} ref={this.REF} {...rest}>
          {props.content || props.children}
        </Tag>
      </ModuleContext.Provider>
    );
  }
}

export const SubComponent = props => (
  <Component subComponent={true} {...props}>{props.children}</Component>
);