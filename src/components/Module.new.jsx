
import camelCase from 'camelcase';

import deepextend from '../utilities/deepMergeObjects';
import useTheme from '../hooks/useTheme';
import useUtils from '../hooks/useUtils';

import { MODULEContext as ModuleContext } from './module';
// const ModuleContext = React.createContext({});

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
  
  const Tag = getTag(props);
  const namespace = name;
  const styleSignature = prevContext.styles?.[namespace] || styles || {};

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

  const [appliedStyles, setAppliedStyles] = React.useState(parseStyles(styleSignature, { 
    theme: THEME, 
    config: CONFIG, 
    state: STATE, 
    utils: UTILS, 
    context: prevContext 
  }));

  /**
   * 
   */

  const handleMouseEnter = (event) => {
    onMouseEnter?.(event);
  
    if (!disabled) {
      setHovered(true);
    }
  }

  const handleMouseLeave = (event) => {
    onMouseLeave?.(event), setHovered(false);
  }

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
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }

  
  console.log(name, prevContext.styles);

  const nextContext = {
    ...prevContext,

    ...(!isComponent && { namespace }),

    styles: mergeStyles([prevContext.styles, appliedStyles], { 
      config: CONFIG, 
      theme: THEME, 
      state: STATE, 
      utils: UTILS, 
      context: prevContext 
    }),

    theme: THEME,
    state: STATE,
    [namespace]: STATE,

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

  React.useEffect(() => {
    const newStyles = parseStyles(styleSignature, { 
      config: CONFIG, 
      theme: THEME, 
      state: STATE, 
      utils: UTILS, 
      context: nextContext 
    });

    if (JSON.stringify(appliedStyles) !== JSON.stringify(newStyles)) {
      setAppliedStyles(newStyles);
    }
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

export default Module; export { Component, SubComponent };

/**
 * 
 */
function mergeStyles(styles, options) {
  let evaluatedStyles = styles;

  if (typeof styles === 'function') {
    evaluatedStyles = styles(options);
  }

  if (evaluatedStyles instanceof Array) {
    const mergedSet = {};

    evaluatedStyles.forEach(set => {
      const evaluatedSet = mergeStyles(set, options);

      Object.entries(evaluatedSet).forEach(([key, value]) => {
        const duplicate = mergedSet[key];

        if (duplicate && ['object', 'function'].some($ => typeof value === $)) {
          mergedSet[key] = duplicate instanceof Array ? duplicate.concat(value) : [duplicate, value];
        } else if (value) {
          mergedSet[key] = value;
        }
      });
    });

    evaluatedStyles = mergedSet;
  }

  return evaluatedStyles;
}

/**
 * 
 */
function parseCQ(object, options, prevNamespace) {
  const { state, context } = options;
  const newStyles = Object.assign({}, object);

  Object.entries(newStyles).forEach(([key, value]) => {
    if (typeof value === 'object' && !(value instanceof Array)) {
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
        // console.log(key);
      }

      /** Determine if previously specified parent component is queried modifier/state */
      if (key.indexOf('and-is-') === 0 || key.indexOf('and:') === 0) {
        const CONTEXT = key.indexOf('and:') === 0 ? key.replace('and', '') : key.replace('and-is-', '');
        // console.log(key);
      }

      /** Determine if specified parent component is queried modifier/state */
      if (key.indexOf('-is-') > -1 || key.indexOf(':') > 0) {
        const COMPONENT = key.indexOf(':') > 0 ? key.slice(0, key.indexOf(':')) : key.slice(0, key.indexOf('-is-'));
        const CONTEXT = key.indexOf(':') > 0 ? key.slice(key.indexOf(':'), key.length) : key.slice(key.indexOf('-is-') + 4, key.length);

        if (context[COMPONENT][CONTEXT]) {
          Object.assign(newStyles, parseCQ(value, options, COMPONENT));
        }

        delete newStyles[key];
      }

      /** Determine if element is a child of the queried component/module */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');
        // console.log(key);
      }

      /** Key defines pseudo-state */
      if (key.indexOf(':') === 0) {
        if (state[key]) {
          Object.assign(newStyles, parseCQ(value, options));
        }

        delete newStyles[key];
      }
    }
  });

  // Convert keys to camelCase
  Object.keys(newStyles).forEach(key => {
    const EVALUATEDKEY = /^[%*:$]/.test(key) ? key : camelCase(key);

    if (key !== EVALUATEDKEY) {
      newStyles[EVALUATEDKEY] = newStyles[key];
      delete newStyles[key];
    }
  });

  return newStyles;
}

/**
 * 
 */
function parseStyles(styles, options) {
  let evaluatedStyles = mergeStyles(styles, options);

  ['focused', 'disabled', 'hovered', ':first-child', ':last-child'].forEach(key => delete evaluatedStyles[key]);

  return parseCQ(evaluatedStyles, options);
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