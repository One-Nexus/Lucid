/**
 * Generate CSS classes for a module
 */
export default function generateClasses({ 
    props, 
    namespace, 
    modifiers, 
    classes, 
    modifierGlue, 
    componentGlue, 
    multipleClasses 
}) {
    let classNames = [];

    // Get modules from props
    Object.entries(props).forEach(([key, value]) => {
        const firstLetter = key[0];

        if (firstLetter === firstLetter.toUpperCase()) {
            const module = key.toLowerCase();

            if (multipleClasses) {
                classNames.push(module);

                if (value.constructor === Array) {
                    value.forEach(modifier => {
                        classNames.push(module + modifierGlue + modifier);
                    });
                } else if (typeof value === 'string') {
                    classNames.push(module + modifierGlue + value);
                }
            } 
            else {
                let propModifiers = '';
    
                if (value.constructor === Array) {
                    propModifiers = modifierGlue + value.join(modifierGlue);
                } else if (typeof value === 'string') {
                    propModifiers = modifierGlue + value;
                }

                classNames.push(module + propModifiers);
            }
        }
    });

    // if (namespace.indexOf(componentGlue > 0)) {
    //     if (props.name instanceof Array) {
    //         // @TODO
    //     }
    // }

    if (multipleClasses) {
        // @TODO refactor the whole thing because we are splitting
        // what was originally unsplit to begin with
        modifiers.split(modifierGlue).forEach(modifier => {
            let className;

            if (modifier) {
                className = namespace + modifierGlue + modifier;
            } else {
                className = namespace;
            }
            
            classNames.push(className);
        });
    } 
    else {
        classNames.push(namespace + modifiers);
    }

    classes = classNames.join(' ') + (classes ? ' ' + classes : '');

    return classes;
}