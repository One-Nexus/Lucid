import deepextend from '../utilities/deepMergeObjects';

export default (config = {}, theme = {}) => {
  const evaluatedConfig = (typeof config === 'function') ? config(theme) : config;
  const themeConfig = (theme.modules && theme.modules[evaluatedConfig.name]) || {};

  return deepextend(evaluatedConfig, themeConfig);
}