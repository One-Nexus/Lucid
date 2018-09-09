/**
 * Handle the ref callback on the rendered React component
 * 
 * @param {HTMLElement} node - the DOM element of the rendered React component
 * @param {Object} props - the props of the React component
 * @param {*} styleParser 
 */
export default function refHandler(node, props, styleParser) {
    if (node) {
        if (props.styles && styleParser) {
            styleParser(node, ...props.styles)
        }

        if (props.init) {
            props.init(node);
        }
    }
}