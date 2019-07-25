import Component from './component';

const styled = (name, props, tag='div') => {
  return (
    <Component name={name} tag={tag} {...props}>
      {props.children}
    </Component>
  );
}

export default styled;