export default function generateElementClasses({ NAMESPACE, MODIFIERS, MODIFIERGLUE, SINGLECLASS }) {
  let CLASSES = '';

  MODIFIERS = MODIFIERS.filter(MODIFIER => typeof MODIFIER === 'string');

  if (SINGLECLASS) {
    NAMESPACE += MODIFIERS.length ? MODIFIERGLUE + MODIFIERS.join(MODIFIERGLUE) : '';
  } else {
    MODIFIERS.forEach(MODIFIER => CLASSES += NAMESPACE + MODIFIERGLUE + MODIFIER + ' ');
  }

  return CLASSES += NAMESPACE;
}