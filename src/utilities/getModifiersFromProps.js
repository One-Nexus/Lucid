/**
 * @param {*} props 
 * @param {*} blacklist 
 */
export default function getModifiersFromProps(props, blacklist = []) {
  const modifiers = [];

  for (var prop in props) {
    const [key, value] = [prop, props[prop]];
    const firstLetter = prop[0];

    // if prop is name of module, do not include in list
    if (firstLetter === firstLetter.toUpperCase()) {
      continue;
    }

    if (prop === 'subComponent') {
      continue;
    }

    if (typeof value === 'boolean' && value) {
      if (blacklist.indexOf(key) < 0) {
        modifiers.push(key);
      }
    }
  }

  return modifiers;
}