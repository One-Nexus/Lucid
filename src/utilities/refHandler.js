/**
 * Handle the ref callback on the rendered React component
 * 
 * @param {HTMLElement} node - the DOM element of the rendered React component
 * @param {Object} props - the props of the React component
 * @param {Function} styleParser 
 */
export default function refHandler(node, props, styleParser) {
    if (node) {
        Object.assign(node, {
            isFirstChild: node === node.parentNode.firstChild,
            isLastChild : node === node.parentNode.lastChild
        });

        if (styleParser) {
            if (props.styles) {
                styleParser(node, ...props.styles);
            }

            else if (props.name && window[props.name]) {
                if (window[props.name] && window[props.name].layout && window[props.name].defaults) {
                    const config = Module.config(window[props.name].defaults(window.theme), window.theme[module]);

                    styleParser(node, window[props.name].layout, config, window.theme);
                }
            }

            Object.entries(props).forEach(prop => {
                if (prop[0][0] === prop[0][0].toUpperCase()) {
                    const module = prop[0].toLowerCase();

                    if (window[prop[0]] && window[prop[0]].layout && window[prop[0]].defaults) {
                        const config = Module.config(window[prop[0]].defaults(window.theme), window.theme[module]);

                        node.namespace = node.namespace || module;

                        styleParser(node, window[prop[0]].layout, config, window.theme);
                    }
                }
            });
        }

        if (props.init) {
            props.init(node);
        } 

        else if (window[props.name] && window[props.name].init) {
            window[props.name].init(node);
        }
    }
}