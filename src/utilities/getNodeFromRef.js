export default function getNodeFromRef(ref) {
  if (ref.current instanceof HTMLElement) {
    return ref.current;
  } 
  else if (ref.current) {
    return getNodeFromRef(ref.current.REF);
  } 
  else {
    return;
  }
}