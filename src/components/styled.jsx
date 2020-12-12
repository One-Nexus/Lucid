import { Component } from './module';

if (typeof React === 'undefined') {
  var React = require('react');
}

const styled = (name, props, tag='div') => {
  return (
    <Component name={name} tag={tag} {...props}>
      {props.children}
    </Component>
  );
}

export default styled;