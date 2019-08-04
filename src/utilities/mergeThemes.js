export default function mergeThemes(...themes) {
  let THEME = {};

  [...themes].forEach(theme => {
    if (typeof theme === 'function') {
      THEME = deepMergeObjects(THEME, theme(THEME));
    } else {
      THEME = deepMergeObjects(THEME, theme);
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