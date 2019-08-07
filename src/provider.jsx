import React from 'react';

export const ThemeContext = React.createContext({});

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