import deepextend from '../utilities/deepMergeObjects';
import useTheme from './useTheme';

export default (config = {}, theme = useTheme(), props) => {
  if (config.config && !props) {
    config = config.config, props = config;
  }

  const evaluatedConfig = (typeof config === 'function') ? config(theme) : config;
  const themeConfig = (theme.modules && theme.modules[evaluatedConfig.name]) || {};

  return deepextend(evaluatedConfig, themeConfig, props);
}