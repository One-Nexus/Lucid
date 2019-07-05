import React from 'react';
import { ModuleContext } from './module.jsx';
import Polymorph, { paint } from './react-polymorph';

/**
 * Render a Synergy component
 */
export default class Component extends React.Component {
  constructor(props) {
    super(props);

    this.REF = React.createRef();

    this.state = {
      isHovered: false,
      isFirstChild: true,
      isLastChild: false
    }
  }

  handleMouseEnter() {
    this.setState({
      isHovered: true
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovered: false
    });
  }
  
  foo() {
    return Polymorph(this.context.STYLES[this.props.name], {
      theme: this.THEME,
      config: this.CONFIG,
      state: { ...this.state, ...this.props },
      context: this.context
    });
  }

  getEventHandlers(properties) {}

  componentDidMount() {
    if (this.context.STYLES) {
      paint(this.REF.current, this.context.STYLES[this.props.name], {
        theme: this.context.THEME,
        config: this.context.CONFIG,
        state: { ...this.state, ...this.props },
        context: this.context
      });
    }
  }

  componentDidUpdate() {
    console.log(this.REF.current)
    if (this.context.STYLES) {
      paint(this.REF.current, this.context.STYLES[this.props.name], {
        theme: this.context.THEME,
        config: this.context.CONFIG,
        state: { ...this.state, ...this.props },
        context: this.context
      });
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

      STYLES: { ...this.context.STYLES, ...this.foo() }
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