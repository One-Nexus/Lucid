export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.applyStyles = this.applyStyles.bind(this);
  }

  applyStyles(styles) {
    if (JSON.stringify(styles) !== JSON.stringify(this.state.styles)) {
      this.setState({ styles });
    }
  }

  render() {
    const NAMESPACE = this.props.name || 'wrapper';
    const CHILD = this.props.children.length ? this.props.children[0] : this.props.children;
    const MODULE = this.props.module || CHILD.props.name || CHILD.type.name;

    const PROPS = {
      [MODULE]: true,
      styles: this.state.styles,
      setWrapperStyles: this.applyStyles,
      permeable: true
    }

    return (
      <Module name={NAMESPACE} {...this.props} {...PROPS}>
        {this.props.children}
      </Module>
    );
  }
}

export const Group = (props) => <Wrapper name='group' {...props}>{props.children}</Wrapper>;