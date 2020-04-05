import $Module from './module';
import Component from './component';

if (typeof React === 'undefined') {
  var React = require('react');
}

const Module = (props) => {
  if (typeof props.as === 'string') {
    return <$Module component={Component} {...props} />
  }
  else {
    return <$Module {...props} />
  }
}

Module.modifiers = (props) => ([...Object.keys(props), ...(props.modifiers || [])]);

export default Module;