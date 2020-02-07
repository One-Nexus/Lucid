export default function deepMergeObjects(...params) {
  if (process.env.SYNERGY) {
    return Synergy.deepextend(...params);
  } 
  else if (typeof Synergy !== 'undefined' && typeof Synergy.deepextend === 'function') {
    return Synergy.deepextend(...params);
  } 
  else {
    return require('deep-extend')(...params);
  }
}