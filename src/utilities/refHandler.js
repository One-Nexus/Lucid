/**
 * Handle the ref callback on the rendered React component
 */
export default function refHandler(node, props, styleParser, parentModule, theme, config) {
    if (node && node instanceof HTMLElement) {
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

            Object.keys(props).forEach(prop => {
                const fistLetter = prop[0];

                if (fistLetter === fistLetter.toUpperCase()) {
                    if (window[prop] && window[prop].layout && window[prop].defaults) {
                        const _config = Module.config(window[prop].defaults(theme), theme[prop]);

                        node.namespace = node.namespace || prop;

                        styleParser(node, window[prop].layout, _config, theme);
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