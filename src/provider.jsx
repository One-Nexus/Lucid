export const UIContext = React.createContext({ 
  theme: {}, utils: {} 
});

export default (props) => (
  <UIContext.Provider value={{ theme: props.theme, utils: props.utils }}>
    {props.children}
  </UIContext.Provider>
);