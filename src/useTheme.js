import { UIContext } from './provider';

export default () => {
  const { theme } = React.useContext(UIContext);

  return theme;
}