/**
 * Handle the ref callback on the rendered React component
 */
export default function handleMount(node, props, context = {}, styleParser, parentModule, ui, config) {
    if (node && node instanceof HTMLElement) {
        Object.assign(node, {
            isFirstChild: node === node.parentNode.firstChild,
            isLastChild : node === node.parentNode.lastChild,
            state: props,
            context: context.props,
            config: config
        });

        const NAMESPACE = props.name || config.name;

        if (styleParser) {
            if (parentModule) {
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

        if (parentModule) {
            if (props.init) {
                props.init(node);
            } else if (window[NAMESPACE] && window[NAMESPACE].init) {
                window[NAMESPACE].init(node);
            }
        }

        // @NOTE: below currently replaced in favour of `componentDidMount`
        //
        // const observer = new MutationObserver(() => node.repaint && node.repaint());

        // observer.observe(node, {
        //     attributes: true, 
        //     attributeFilter: ['class'],
        //     childList: false, 
        //     characterData: false
        // });
    }
}