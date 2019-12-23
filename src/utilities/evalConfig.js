export default function evalConfig(config, theme) {
  if (!config) return;

  Object.entries(config).forEach((entry) => {
    const key = entry[0]; 
    const value = entry[1];

    if (typeof value === 'object') {
      return evalConfig(value, theme)
    }

    if (typeof value === 'function') {
      config[key] = value(theme);
    }
  });

  return config;
}