export default function evalConfig(THEME) {
  if (!THEME) return;

  Object.entries(THEME).forEach((entry) => {
    const key = entry[0]; 
    const value = entry[1];

    if (typeof value === 'object') {
      return evalConfig(value)
    }

    if (typeof value === 'function') {
      THEME[key] = value(THEME);
    }
  });

  return THEME;
}