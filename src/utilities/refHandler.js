/**
 * Handle the ref callback on the rendered React component
 */
export default function refHandler(node, props, styleParser, parentModule, ui, config) {
    if (node && node instanceof HTMLElement) {
        Object.assign(node, {
            isFirstChild: node === node.parentNode.firstChild,
            isLastChild : node === node.parentNode.lastChild
        });

        if (parentModule) {
            node.config = config;
        }

        const NAMESPACE = props.name || config.name;

        if (styleParser) {
            if (props.styles) {
                if (props.styles.constructor === Array) {
                    styleParser(node, ...props.styles);
                }
                else {
                    styleParser(node, props.styles, config, ui);
                }
            }

            else if (window[NAMESPACE] && window[NAMESPACE].layout) {
                styleParser(node, window[NAMESPACE].layout, config, ui);
            }

            Object.keys(props).forEach(prop => {
                const fistLetter = prop[0];

                if (fistLetter === fistLetter.toUpperCase()) {
                    if (window[prop] && window[prop].layout && window[prop].config) {
                        node.namespace = node.namespace || window[prop].config.name || prop;

                        styleParser(node, window[prop].layout, window[prop].config, ui);
                    }
                }
            });
        }

        if (props.init) {
            props.init(node);
        } 

        else if (window[NAMESPACE] && window[NAMESPACE].init) {
            window[NAMESPACE].init(node);
        }
    }
}