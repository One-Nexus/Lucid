/** Handle the ref callback on the rendered React component */
export default function handleUpdate(node, props, context = {}) {
    if (!node) return;

    delete context.children;
    delete context.styles;

    Object.assign(node, {
        isFirstChild: node === node.parentNode.firstChild,
        isLastChild : node === node.parentNode.lastChild,
        state: props,
        context: context
    });
}