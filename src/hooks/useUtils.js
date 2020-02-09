import { UIContext } from '../components/provider';

export default () => {
  const { utils } = React.useContext(UIContext);

  return utils;
}