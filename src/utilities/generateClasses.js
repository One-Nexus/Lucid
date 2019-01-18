/**
 * Generate CSS classes for a module
 */
export default function generateClasses(props, classes, modifierGlue) {
    // Get modules from props
    Object.entries(props).forEach(prop => {
        const firstLetter = prop[0][0];

        if (firstLetter === firstLetter.toUpperCase()) {
            const module = prop[0].toLowerCase();

            let modifiers = '';

            if (prop[1].constructor === Array) {
                modifiers = modifierGlue + prop[1].join(modifierGlue);
            } else if (typeof prop[1] === 'string') {
                modifiers = modifierGlue + prop[1];
            }

            classes = classes + ' ' + module + modifiers;
        }
    });

    return classes;
}