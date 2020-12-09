
import camelCase from 'camelcase';

import deepextend from '../utilities/deepMergeObjects';
import useTheme from '../hooks/useTheme';
import useUtils from '../hooks/useUtils';

import { MODULEContext as ModuleContext } from './module';
// const ModuleContext = React.createContext({});

const LUCID_STATES = ['focused', 'disabled', 'hovered', ':first-child', ':last-child'];

const Module = (props) => {
  const { children, name, styles, config, render, onMouseEnter, onMouseLeave, onFocus, attributes, ...meta } = props;
  const { isComponent, host, className, style, as, roles, tag, ...rest } = meta;

  const namespace = name || tag;

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
  const [{ Tag }, setTag] = React.useState({ Tag: getTag(props) });

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
    ...getInputAttributes(rest),

    ...(!isFunctionComponent(Tag) && { ref }),

    ...(Tag.name === 'Component' && props.as && { 
      name: props.as.name || props.as,
      roles,
      ...rest,
    }),

    style: { ...style, ...appliedStyles },
    className: className ? `${className} ${namespace}` : `${namespace}`,
    onMouseEnter: event => handleMouseEnter(event, onMouseEnter, setHovered, disabled),
    onMouseLeave: event => handleMouseLeave(event, onMouseLeave, setHovered),
    onFocus: event => handleFocus(event, onFocus, setFocused)
  }

  /**
   * 
   */

  const options = context => ({ 
    config: CONFIG, 
    theme: THEME, 
    state: STATE, 
    utils: UTILS, 
    context: context 
  });

  const nextContext = {
    ...prevContext,

    theme: THEME,
    state: STATE,

    namespace,

    ...((!isComponent && props.as) && { owner: namespace }),

    [namespace]: { 
      ...STATE,

      setTag,

      ':hover': shouldDispatchHover && hovered,
      'hovered': styles => !shouldDispatchHover ? setShouldDispatchHover(namespace) : STATE.hovered && styles
    },

    ...(roles && Object.fromEntries(roles.map(key => [key, STATE]))),

    isFusion: isFunctionComponent(props.as) && !isComponent,
  }

  const flushedBlueprints = (!isComponent && !props.as) ? {} : prevBlueprints;
  const nextBlueprints = blueprints ? mergeStyles([flushedBlueprints, blueprints], options(nextContext)) : flushedBlueprints;

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

    if (props.isComponent && prevContext.namespace === namespace && prevContext.owner) {
      prevContext[namespace].setTag({ Tag: React.Fragment });
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

    // if (disabled !== (props.disabled || node.disabled)) {
    //   setDisabled(node.disabled);
    // }

    // focus/blur handling
    node && new MutationObserver(mutations => mutations.forEach(({ type, target }) => {
      if (type === 'attributes') {
        setDisabled(target.disabled);

        if (target.disabled) {
          setHovered(false), setFocused(false);
        }
      }
    })).observe(node, { attributes: true });
  }, []);

  React.useEffect(() => {
    const newStyles = parseStyles(nextBlueprints?.[namespace] || styles || {}, options(prevContext));

    if (roles) {
      const aliasStyles = roles.reduce(($, alias) => {
        const styles = nextBlueprints?.[alias];

        if (styles) {
          Object.assign($, parseStyles(styles, options(prevContext)).appliedStyles);
        }

        return $;
      }, {});

      if (Object.keys(aliasStyles).length > 0) {
        Object.assign(newStyles.appliedStyles, aliasStyles);
      }
    }

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
function getInputAttributes(props) {
  let inputAttributes = {}

  const whitelist = [
    'type',
    'value',
    'readonly',
    'disabled',
    'size',
    'maxlength',
    'autocomplete',
    'autofocus',
    'min',
    'max',
    'multiple',
    'pattern',
    'placeholder',
    'selected',
    'required',
    'step'
  ];

  for (let prop in props) {
    if (whitelist.includes(prop)) {
      inputAttributes[prop] = props[prop];
    }
    if (prop === 'group') {
      inputAttributes.name = props[prop];
    }
  }

  return inputAttributes;
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
function getTag(props) {
  if (typeof props.as === 'function' && props.as.name[0] === props.as.name[0].toUpperCase()) {
    return props.as;
  }

  if (typeof props.as === 'function' && props.as?.prototype?.isReactComponent) {
    return props.as;
  }

  if (props.component) {
    return props.component;
  }

  if (props.tag) {
    return props.tag;
  }

  return (typeof props.as === 'string' && !props.isComponent) ? Component : 'div';
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
  onMouseLeave?.(event);
  setHovered(false);
}

/**
 * 
 */
function handleFocus(event, onFocus, setFocused) {
  event.persist();

  onFocus && onFocus(event);

  setFocused(true);

  const handleBlur = () => {
    setFocused(false);

    event.target.blur();

    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mousedown', handleMousedown);
  }

  const handleKeydown = ({ keyCode }) => keyCode === 9 && handleBlur();
  const handleMousedown = () => handleBlur();

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('mousedown', handleMousedown);
}