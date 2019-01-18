/**
 * @param {*} modifiers 
 */
export default function renderModifiers(modifiers, modifierGlue) {
    if (modifiers && typeof modifiers === 'object' && modifiers.length) {
        return (modifierGlue + modifiers).replace(/,/g, modifierGlue);
    }

    return '';
}