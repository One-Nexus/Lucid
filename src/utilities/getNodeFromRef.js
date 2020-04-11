export default function getNodeFromRef(ref) {
  const { current } = ref;

  if (!current) {
    return;
  }

  if (current instanceof HTMLElement) {
    return current;
  }

  if (current.instance) {
    return current.instance._reactInternalFiber.child.stateNode;
  }

  return;
}