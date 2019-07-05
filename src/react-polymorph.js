export default function polymorph(styles = {}, options) {
  if (typeof styles === 'function') {
    styles = styles(options);
  }

  return styles;
}

export function paint(node, styles = {}, options) {
  if (typeof styles === 'function') {
    styles = styles(options);
  }

  Object.entries(styles).forEach(([key, value]) => {
    try {
      node.style[key] = value;
    } catch(error) {
      return error;
    }
  });
}