import useTheme from '../hooks/useTheme';
import useUtils from '../hooks/useUtils';

import { MODULEContext as ModuleContext } from './module';
// const ModuleContext = React.createContext({});

const Module = (props) => {
  const { children, name, styles, config, render, onMouseEnter, onMouseLeave, component, attributes, ...rest } = props;

  const prevContext = React.useContext(ModuleContext);
  const ref = React.useRef();

  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  
  const Tag = 'div';
  const namespace = name;
  const styleSignature = prevContext.styles?.[namespace] || styles;

  /**
   * 
   */

  const THEME  = prevContext.theme || useTheme();
  const UTILS  = prevContext.utils || useUtils();
  const CONFIG = config?.(THEME);
  const STATE  = { hovered, focused, disabled, ...rest };

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

    style: appliedStyles,
    className: `${namespace}`,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ref: ref
  }

  const nextContext = {
    ...prevContext,

    ...(!component && { namespace }),

    styles: { ...prevContext.styles, ...appliedStyles },
    theme: THEME,
    state: STATE,
    [namespace]: STATE
  }

  /**
   * 
   */

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

const FOOComponent = (props) => {
  return (
    <Module component {...props} />
  );
}

export default Module;

export { FOOComponent };

/**
 * 
 */
function parseStyles(signature, options) {
  let evaluatedsignature = signature;

  if (typeof signature === 'function') {
    evaluatedsignature = signature(options);
  }

  if (evaluatedsignature instanceof Array) {
    const mergedSet = {};

    evaluatedsignature.forEach(set => {
      const evaluatedSet = parseStyles(set, options);

      Object.entries(evaluatedSet).forEach(([key, value]) => {
        const existingEntry = mergedSet[key];

        if (existingEntry) {
          mergedSet[key] = existingEntry instanceof Array ? existingEntry.concat(value) : [existingEntry, value];
        } else {
          mergedSet[key] = value;
        }
      });
    });

    evaluatedsignature = mergedSet;

  // if (typeof evaluatedsignature !== 'object') {
  //   console.warn(evaluatedsignature);
  // }
  }

  ['focused', 'disabled', 'hovered'].forEach(key => delete evaluatedsignature[key]);

  return parseCQ(evaluatedsignature, options);
}

/**
 * 
 */
function parseCQ(object, options) {
  const { state, context } = options;

  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object') {
      /** Determine if element is queried modifier/state */
      if (key.indexOf('is-') === 0) {
        const CONTEXT = key.replace('is-', '');
        // console.log(key);
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
        // console.log(key);
      }

      /** Determine if element is a child of the queried component/module */
      if (key.indexOf('in-') === 0) {
        const COMPONENT = key.replace('in-', '');
        // console.log(key);
      }

      /** Key defines hover pseudo-state */
      if (key === 'hover') {
        // console.log(key);
      }

      /** Key defines pseudo-state */
      if (key.indexOf(':') === 0) {
        // console.log(key);
      }
    }
  });

  return object;
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
function getEventHandlers(props) {
  return Object.keys(props).filter(key => isEventHandler(key)).reduce((accumulator, key) => {
    accumulator[key] = props[key]
    
    return accumulator;
  }, {})
}