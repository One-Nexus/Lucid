import React from 'react';
import Module, { ModuleContext } from './module.jsx';

/**
 * Render a Synergy component
 */
export default class Component extends Module {
  componentDidMount() {
    if (this.context.STYLES) {
      this.paint(this.REF.current, this.context.STYLES[this.props.name], this.stylesConfig());
    }
  }

  componentDidUpdate() {
    if (this.context.STYLES) {
      this.paint(this.REF.current, this.context.STYLES[this.props.name], this.stylesConfig());
    }
  }

  render() {
    const { props } = this;
    const { MODIFIERGLUE, COMPONENTGLUE }  = this.context;

    const Tag = (props.href && 'a') || props.component || props.tag || 'div';
    const classNames = this.context.NAMESPACE + COMPONENTGLUE + props.name;

    const rest = {
      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this)
    }

    const styles = this.getStyles(this.context.STYLES[props.name], this.stylesConfig());
    const [before, after] = [styles[':before'], styles[':after']];

    const contextValues = { 
      ...this.context,
      ...this.state,
      ...props,

      [props.name]: {
        ...this.state,
        ...props
      },

      STYLES: { 
        ...this.context.STYLES, 
        ...styles
      }
    }

    return (
      <ModuleContext.Provider value={contextValues}>
        <Tag className={classNames} data-component={props.name} ref={this.REF} {...rest}>
          {before && <div className='before' style={before}>{before.content}</div>}

          {props.content || props.children}

          {after && <div className='after' style={after}>{after.content}</div>}
        </Tag>
      </ModuleContext.Provider>
    );
  }

  static contextType = ModuleContext;
}

export const SubComponent = props => (
  <Component subComponent={true} {...props}>{props.children}</Component>
);