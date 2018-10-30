/**
 * Handle the ref callback on the rendered React component
 * 
 * @param {HTMLElement} node - the DOM element of the rendered React component
 * @param {Object} props - the props of the React component
 * @param {Function} styleParser 
 * @param {Boolean} parentModule 
 * @param {Object} theme 
 */
export default function refHandler(node, props, styleParser, parentModule, theme, config) {
    if (node) {
        Object.assign(node, {
            isFirstChild: node === node.parentNode.firstChild,
            isLastChild : node === node.parentNode.lastChild
        });

        if (parentModule && window[props.name] && window[props.name].defaults) {
            node.config = config;
        }

        if (styleParser) {
            if (props.styles) {
                styleParser(node, ...props.styles);
            }

            else if (props.name && window[props.name]) {
                if (window[props.name] && window[props.name].layout && window[props.name].defaults) {
                    styleParser(node, window[props.name].layout, config, theme);
                }
            }

            Object.entries(props).forEach(prop => {
                if (prop[0][0] === prop[0][0].toUpperCase()) {
                    const module = prop[0].toLowerCase();

                    if (window[prop[0]] && window[prop[0]].layout && window[prop[0]].defaults) {
                        const _config = Module.config(window[prop[0]].defaults(theme), theme[module]);

                        node.namespace = node.namespace || module;

                        styleParser(node, window[prop[0]].layout, _config, theme);
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