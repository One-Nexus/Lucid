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
    // UPDATE: in retrospect, this actually would be useful, so commenting out
    // if (firstLetter === firstLetter.toUpperCase()) {
    //   continue;
    // }

    if (prop === 'subComponent') {
      continue;
    }

    // @TODO add these (with above subComponent) to whitelist array instead
    if (prop === 'permeable') {
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