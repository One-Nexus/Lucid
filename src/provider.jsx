import React from 'react';

const ThemeContext = React.createContext({});
export { ThemeContext }

export default class Provider extends React.Component {
  render() {
    const theme = this.props.theme;

    return (
      <ThemeContext.Provider value={theme}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }

  static contextType = ThemeContext;
}