import Module from './module';
import Component from './component';

if (typeof React === 'undefined') {
  var React = require('react');
}

export default (props) => {
  if (typeof props.as === 'string') {
    return <Module component={Component} {...props} />
  }
  else {
    return <Module {...props} />
  }
}