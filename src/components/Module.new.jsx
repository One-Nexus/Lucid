
import camelCase from 'camelcase';

import deepextend from '../utilities/deepMergeObjects';
import useTheme from '../hooks/useTheme';
import useUtils from '../hooks/useUtils';

import { MODULEContext as ModuleContext } from './module';
// const ModuleContext = React.createContext({});

const LUCID_STATES = ['focused', 'disabled', 'hovered', ':first-child', ':last-child'];

const Module = (props) => {
  const { children, name, styles, config, render, onMouseEnter, onMouseLeave, attributes, ...meta } = props;
  const { isComponent, host, className, style, as, ...rest } = meta;

  const { context: prevContext, blueprints: prevBlueprints } = React.useContext(ModuleContext);
  const ref = host || React.useRef();

  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [isFirstChild, setIsFirstChild] = React.useState(false);
  const [isLastChild, setIsLastChild] = React.useState(false);
  const [index, setIndex] = React.useState();
  const [shouldDispatchHover, setShouldDispatchHover] = React.useState(false);
  const [{ appliedStyles, blueprints }, setAppliedStyles] = React.useState({});
  
  const namespace = name;
  const Tag = getTag(props, prevContext, namespace);

  /**
   * 
   */

  const THEME  = prevContext.theme || useTheme();
  const THEMECONFIG = THEME.modules?.[name];
  const PROPCONFIG = config?.(THEME) || {};
  const UTILS  = prevContext.utils || useUtils();
  const CONFIG = deepextend(PROPCONFIG, THEMECONFIG);

  const STATE  = {
    ...(prevContext.isFusion && prevContext.state),

    ':hover': hovered, 
    ':focus': focused, 
    ':disabled': disabled,
    ':first-child': isFirstChild,
    ':last-child': isLastChild,

    hovered, focused, disabled, isFirstChild, isLastChild, index,

    ...rest
  }

  const ATTRIBUTES = Tag !== React.Fragment && {
    ...attributes,

    ...getEventHandlers(rest),

    ...(!isFunctionComponent(Tag) && { ref }),

    ...(Tag.name === 'Component' && props.as && { 
      name: props.as.name || props.as,

      ...rest,
    }),

    style: { ...style, ...appliedStyles },
    className: className ? `${className} ${namespace}` : `${namespace}`,
    onMouseEnter: event => handleMouseEnter(event, onMouseEnter, setHovered, disabled),
    onMouseLeave: event => handleMouseLeave(event, onMouseLeave, setHovered)
  }

  /**
   * 
   */

  const nextContext = {
    ...prevContext,

    ...(!isComponent && { namespace }),
    namespace,

    theme: THEME,
    state: STATE,

    [namespace]: { ...STATE, ...{
      ':hover': shouldDispatchHover && hovered,
      hovered: styles => !shouldDispatchHover ? setShouldDispatchHover(namespace) : STATE.hovered && styles
    }},

    isFusion: isFunctionComponent(props.as) && !isComponent,
  }

  const options = { 
    config: CONFIG, 
    theme: THEME, 
    state: STATE, 
    utils: UTILS, 
    context: nextContext 
  }

  const nextBlueprints = blueprints ? mergeStyles([prevBlueprints, blueprints], options) : prevBlueprints;

  /**
   * 
   */

  React.useEffect(() => {
    let node = ref.current;

    if (!node) { 
      return;
    }

    // Last ditch effort to get underlying DOM node
    if (!(node instanceof HTMLElement)) {
      node = ReactDOM.findDOMNode(node);
    }

    const siblings = [...node.parentNode.childNodes];
    const index = siblings.indexOf(node);

    {
      setIndex(index);
    }

    if (index === 0) {
      setIsFirstChild(true);
    }

    if (index === siblings.length - 1) {
      setIsLastChild(true);
    }
  }, []);

  React.useEffect(() => {
    console.log(nextContext)
    const styleSignature = prevBlueprints?.[namespace] || styles || {};
    const newStyles = parseStyles(styleSignature, options);

    setAppliedStyles(newStyles);
  }, [JSON.stringify(nextContext)]);

  /**
   * 
   */
  return (
    <ModuleContext.Provider value={{ context: nextContext, blueprints: nextBlueprints }}>
      <Tag {...ATTRIBUTES}>
        {render || children}
      </Tag>
    </ModuleContext.Provider>
  );
}

Module.modifiers = props => ([...Object.keys(props), ...(props.modifiers || [])]);

export default Module; 

/**
 * 
 */
const Component = props => {
  return <Module isComponent {...props} />;
}

/**
 * 
 */
const SubComponent = props => {
  return <Module isComponent {...props} />;
}

export { Component, SubComponent };

/**
 * 
 */
function parseStyles(styles, options) {
  const mergedStyles = mergeStyles(styles, options);
  const evaluatedStyles = parseCQ(mergedStyles, options, { isPainting: true });

  return evaluatedStyles;
}

/**
 * 
 */
function mergeStyles(styles, options, accumulator) {
  if (typeof styles === 'function') {
    styles = styles(options);
  }

  if (styles instanceof Array) {
    styles = styles.reduce(($, set) => Object.assign($, mergeStyles(set, options, $)), accumulator || {});
  }

  const evaluatedStyles = {};

  Object.entries(styles).forEach(([key, value]) => {
    if (value) {
      evaluatedStyles[key] = value;
    }

    if (accumulator) {
      const duplicate = accumulator[key];

      if (duplicate && ['object', 'function'].some($ => typeof value === $)) {
        evaluatedStyles[key] = duplicate instanceof Array ? duplicate.concat(value) : [duplicate, value];
      }
    }
  });

  return evaluatedStyles;
}

/**
 * 
 */
function parseCQ(object, options, { isPainting } = {}) {
  const { state, context } = options;

  if (object instanceof Array) {
    object = mergeStyles(object, options);
  }

  const [appliedStyles, blueprints] = [{}, {}];

  for (let [key, value] of Object.entries(object)) {
    if (typeof value === 'object') {
      /** Determine if element is queried modifier/state */
      if (key.indexOf('is-') === 0) {
        const CONTEXT = key.replace('is-', '');

        if (state[CONTEXT]) {
          Object.assign(appliedStyles, parseCQ(value, options).appliedStyles);
        }
      }

      /** Determine if parent module/block is queried modifier/state */
      if (key.indexOf('$-is-') === 0 || key.indexOf('$:') === 0) {
        const MODULE = context.namespace;
        const CONTEXT = key.indexOf('$:') === 0 ? key.slice(1, key.length) : key.slice(5, key.length);
      }

      /** Determine if previously specified parent component is queried modifier/state */
      if (key.indexOf('and-is-') === 0 || key.indexOf('and:') === 0) {
        const CONTEXT = key.indexOf('and:') === 0 ? key.replace('and', '') : key.replace('and-is-', '');
      }

      /** Determine if specified parent component is queried modifier/state */
      if (key.indexOf('-is-') > -1 || key.indexOf(':') > 0) {
        const COMPONENT = key.indexOf(':') > 0 ? key.slice(0, key.indexOf(':')) : key.slice(0, key.indexOf('-is-'));
        const CONTEXT = key.indexOf(':') > 0 ? key.slice(key.indexOf(':'), key.length) : key.slice(key.indexOf('-is-') + 4, key.length);

        if (context[COMPONENT][CONTEXT]) {
          Object.assign(appliedStyles, parseCQ(value, options).appliedStyles);
        }
      }

      /** Determine if element is a child of the queried component/module */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');
      }

      /** Key defines pseudo-state */
      if (key.indexOf(':') === 0) {
        if (state[key]) {
          Object.assign(appliedStyles, parseCQ(value, options).appliedStyles);
        }
      }

      /** Key defines hover pseudo-state */
      if (key === 'hovered') {
        if (state.hovered) {
          Object.assign(appliedStyles, parseCQ(value, options).appliedStyles);
        }
      }
    }

    const kebabCaseKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    const isCSSProp = Boolean(window.getComputedStyle(document.body).getPropertyValue(kebabCaseKey));

    if (isCSSProp && (typeof value === 'function' || value instanceof Array)) {
      try { 
        value = evaluateValue(value, key) 
      } catch(error) { 
        null;
      }
    }

    const isBlueprintType = (typeof value === 'boolean' || typeof value === 'object' || typeof value === 'function');

    if (isBlueprintType) {
      blueprints[key] = value;
    } else {
      appliedStyles[camelCase(key)] = value;
    }
  }

  return { appliedStyles, blueprints };
}

/**
 * 
 */
function evaluateValue(values, key) {
  if (typeof values === 'function') {
    return isEventHandler(key) ? values : values()
  }

  let value;

  values.forEach(previous => value = (typeof previous === 'function') ? previous(value) : previous);

  return value;
}

/**
 * 
 */
function getEventHandlers(props) {
  return Object.keys(props).filter(key => isEventHandler(key)).reduce((accumulator, key) => {
    accumulator[key] = props[key]
    
    return accumulator;
  }, {})
}

/**
 * 
 */
function isEventHandler(key) {
  return key.startsWith('on') && key[2] === key[2].toUpperCase();
}

/**
 * 
 */
function getTag(props, prevContext, namespace) {
  if (prevContext.namespace === namespace && props.isComponent) {
    return React.Fragment;
  }

  if (typeof props.as === 'function' && props.as.name[0] === props.as.name[0].toUpperCase()) {
    return props.as;
  }

  if (typeof props.as === 'function' && props.as?.prototype?.isReactComponent) {
    return props.as;
  }

  return props.component || (typeof props.as === 'string' && !props.isComponent) ? Component : 'div';
}

/**
 * 
 */
function isFunctionComponent(component) {
  return typeof component === 'function' && component.name[0] === component.name[0].toUpperCase();
}

/**
 * 
 */
function usePreviousContext(value) {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

/**
 * 
 */
function handleMouseEnter(event, onMouseEnter, setHovered, disabled) {
  onMouseEnter?.(event);

  if (!disabled) {
    setHovered(true);
  }
}

/**
 * 
 */
function handleMouseLeave(event, onMouseLeave, setHovered) {
  onMouseLeave?.(event), setHovered(false);
}