export default function generateElementClasses({ NAMESPACE, MODIFIERS, MODIFIERGLUE, SINGLECLASS }) {
  let CLASSES = '';

  if (MODIFIERS.constructor === Object) {
    MODIFIERS = Object.keys(MODIFIERS).filter(key => typeof MODIFIERS[key] === 'boolean' && MODIFIERS[key]);
  }

  if (SINGLECLASS) {
    NAMESPACE += MODIFIERS.length ? MODIFIERGLUE + MODIFIERS.join(MODIFIERGLUE) : '';
  } else {
    MODIFIERS.forEach(MODIFIER => CLASSES += NAMESPACE + MODIFIERGLUE + MODIFIER + ' ');
  }

  return CLASSES += NAMESPACE;
}