import Module, { Wrapper, Group } from './module';
import Component, { SubComponent } from './component';

const BEM = {
  Block: Module,
  Element: Component,
  SubElement: SubComponent
}

export default {
  Module,
  Component,
  SubComponent
}

export {
  Module,
  Wrapper,
  Group,
  Component,
  SubComponent,
  BEM
}