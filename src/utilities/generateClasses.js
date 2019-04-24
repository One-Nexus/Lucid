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
    Object.entries(props).forEach(prop => {
        const firstLetter = prop[0][0];

        if (firstLetter === firstLetter.toUpperCase()) {
            const module = prop[0].toLowerCase();

            let propModifiers = '';

            if (prop[1].constructor === Array) {
                propModifiers = modifierGlue + prop[1].join(modifierGlue);
            } else if (typeof prop[1] === 'string') {
                propModifiers = modifierGlue + prop[1];
            }

            if (multipleClasses) {
                // @TODO
                console.log(prop[1]);
            } else {
                classes = classes + ' ' + module + propModifiers;
            }
        }
    });

    // @TODO
    // if (props.name instanceof Array) {
        // props.name.forEach(name => {
        //     selector = (selector ? selector + ' ' : '') + `${module + componentGlue + name + modifiers}`
        // });

        // selector = selector + classes;
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