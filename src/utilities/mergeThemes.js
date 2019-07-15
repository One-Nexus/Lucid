export default function mergeThemes(...themes) {
  let THEME = {};

  [...themes].forEach(theme => {
    if (typeof theme === 'function') {
      THEME = deepMergeObjects(THEME, theme(THEME));
    } else {
      THEME = deepMergeObjects(THEME, theme);
    }
  });

  return evalVal(THEME);
}

/** */
function evalVal(theme) {
  let THEME = theme;

  Object.entries(THEME).forEach(([key, value]) => {
    if (typeof value === 'object') {
      THEME[key] = evalVal(value)
    }
    if (typeof value === 'function') {
      THEME[key] = value(THEME);
    }
  });

  return THEME;
}

/** */
function deepMergeObjects(...params) {
  if (process.env.SYNERGY) {
    return Synergy.config(...params);
  } 
  else if (typeof Synergy !== 'undefined' && typeof Synergy.config === 'function') {
    return Synergy.config(...params);
  } 
  else {
    return require('deep-extend')(...params);
  }
}