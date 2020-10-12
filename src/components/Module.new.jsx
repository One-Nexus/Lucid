
import camelCase from 'camelcase';

import deepextend from '../utilities/deepMergeObjects';
import useTheme from '../hooks/useTheme';
import useUtils from '../hooks/useUtils';

import { MODULEContext as ModuleContext } from './module';
// const ModuleContext = React.createContext({});

const LUCID_STATES = ['focused', 'disabled', 'hovered', ':first-child', ':last-child'];

const Module = (props) => {
  const { children, name, styles, config, render, onMouseEnter, onMouseLeave, attributes, ...meta } = props;
  const { isComponent, host, className, style, ...rest } = meta;

  const prevContext = React.useContext(ModuleContext);
  const ref = host || React.useRef();

  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [isFirstChild, setIsFirstChild] = React.useState(false);
  const [isLastChild, setIsLastChild] = React.useState(false);
  const [index, setIndex] = React.useState();
  const [appliedStyles, setAppliedStyles] = React.useState({});
  
  const Tag = getTag(props);
  const namespace = name;

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
  };

  const [foo, setFoo] = React.useState();

  const CONTEXT_STATE = { ...STATE, ...{
    ':hover': foo && hovered,
  
    hovered: (styles) => {
      if (!foo) {
        return setFoo(namespace);
      }

      return STATE.hovered && styles;
    }
  }};

  /**
   * 
   */

  const ATTRIBUTES = {
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

  const nextContext = {
    ...prevContext,

    ...(!isComponent && { namespace }),

    styles: prevContext.styles ? mergeStyles([prevContext.styles, appliedStyles], {
      theme: THEME, 
      config: CONFIG, 
      state: STATE, 
      utils: UTILS, 
      context: prevContext 
    }) : appliedStyles,

    theme: THEME,
    state: STATE,
    [namespace]: CONTEXT_STATE,

    foo,
    isFusion: isFunctionComponent(props.as) && !isComponent
  }

  /**
   * 
   */

  React.useEffect(() => {
    const node = ref.current;

    if (!node) { return };

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

  const FIZZ = Object.assign({}, nextContext);
  delete FIZZ.styles;
  const prevAmount = usePreviousContext(FIZZ);

  React.useEffect(() => {
    if (JSON.stringify(prevAmount) === JSON.stringify(FIZZ)) {
      return;
    }

    // console.log(namespace, nextContext.foo);

    const styleSignature = prevContext.styles?.[namespace] || styles || {};

    const newStyles = parseStyles(styleSignature, { 
      config: CONFIG, 
      theme: THEME, 
      state: STATE, 
      utils: UTILS, 
      context: nextContext 
    });

    setAppliedStyles(newStyles);
  }, [nextContext]);

  /**
   * 
   */
  return (
    <ModuleContext.Provider value={nextContext}>
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
  return (
    <Module isComponent {...props} />
  );
}

/**
 * 
 */
const SubComponent = props => {
  return (
    <Module isComponent {...props} />
  );
}

export { Component, SubComponent };

/**
 * 
 */
function parseStyles(styles, options) {
  const mergedStyles = mergeStyles(styles, options);
  const evaluatedStyles = parseCQ(mergedStyles, options);

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
    evaluatedStyles[key] = value;

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
function parseCQ(object, options, { prevNamespace } = {}) {
  const { state, context } = options;

  if (object instanceof Array) {
    object = mergeStyles(object, options);
  }

  const newStyles = Object.assign({}, object);

  for (let [key, value] of Object.entries(newStyles)) {
    if (typeof value === 'function' || value instanceof Array) {
      try { newStyles[key] = evaluateValue(value) } catch(error) { null };
    }

    if (typeof value === 'object') {
      /** Determine if element is queried modifier/state */
      if (key.indexOf('is-') === 0) {
        const CONTEXT = key.replace('is-', '');

        if (state[CONTEXT]) {
          Object.assign(newStyles, parseCQ(value, options));
        }

        delete newStyles[key];
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
          Object.assign(newStyles, parseCQ(value, options));
        }

        delete newStyles[key];
      }

      /** Determine if element is a child of the queried component/module */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');
      }

      /** Key defines pseudo-state */
      if (key.indexOf(':') === 0) {
        if (state[key]) {
          Object.assign(newStyles, parseCQ(value, options));
        }

        delete newStyles[key];
      }

      /** Key defines hover pseudo-state */
      if (key === 'hovered') {
        if (state.hovered) {
          Object.assign(newStyles, parseCQ(value, options));
        }

        delete newStyles[key];
      }
    }

    const kebabCaseKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    const isCSSProp = Boolean(window.getComputedStyle(document.body).getPropertyValue(kebabCaseKey));
    const EVALUATEDKEY = /^[%*:$]/.test(key) ? key : camelCase(key);

    if (isCSSProp && key !== EVALUATEDKEY) {
      if (value) {
        newStyles[EVALUATEDKEY] = newStyles[key];
      }
      
      delete newStyles[key];
    }
  }

  return newStyles;
}

/**
 * 
 */
function evaluateValue(values) {
  if (typeof values === 'function') {
    return values();
  }

  let value;

  values.forEach(previous => value = (typeof previous === 'function') ? previous(value) : previous);

  return value;
}

/**
 * 
 */
function getEventHandlers(props) {
  const isEventHandler = key => key.startsWith('on') && key[2] === key[2].toUpperCase();

  return Object.keys(props).filter(key => isEventHandler(key)).reduce((accumulator, key) => {
    accumulator[key] = props[key]
    
    return accumulator;
  }, {})
}

/**
 * 
 */
function getTag(props) {
  if (typeof props.as === 'function' && props.as.name[0] === props.as.name[0].toUpperCase()) {
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
    delete value.styles;

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