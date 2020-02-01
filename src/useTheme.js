import { UIContext } from './provider';

export default () => {
  const { theme } = useContext(UIContext);

  return theme;
}