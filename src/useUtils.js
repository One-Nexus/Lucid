import { UIContext } from './provider';

export default () => {
  const { utils } = React.useContext(UIContext);

  return utils;
}