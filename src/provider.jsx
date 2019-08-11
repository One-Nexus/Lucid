import React from 'react';

export const ThemeContext = React.createContext({});

export default (props) => (
  <ThemeContext.Provider value={props.theme}>
    {props.children}
  </ThemeContext.Provider>
);