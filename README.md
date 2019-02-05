> A set of higher-order React components for rendering Synergy modules

<img height="66px" src="http://www.onenexus.io/lucid/images/lucid-logo.png" /><br>

* [Overview](#overview)
* [Installation/Setup](#installationsetup)
* [API](#api)

## Overview

* Use for [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
* Use for rendering [Synergy Modules](#TODO)
* Use for rendering [BEM DOM elements](https://github.com/One-Nexus/Lucid/wiki/Working-With-BEM)
* Encourages [Functional Components](https://javascriptplayground.com/functional-stateless-components-react/) over Class Components
* Adds new [properties and methods](https://github.com/One-Nexus/Lucid/wiki/Interactions#new-element-prototype-propertiesmethods) to Prototype of rendered DOM element
* Naturally enforces a better architecture

###### Example

```jsx
import React from 'react';
import { Module, Component } from '@onenexus/lucid';

const Accordion = ({name = 'accordion', panels, modifiers}) => (
    <Module name={name} modifiers={modifiers}>
        {panels.map(({title, content}, index) => (
            <Component name="panel" key={index}>
                <Component name="title">{title}</Component>
                <Component name="content">{content}</Component>
            </Component>
        ))}
    </Module>
);

const App = () => (
    <Accordion modifiers={['foo', 'bar']} panels={[
        {title: 'foo', content: 'bar'},
        {title: 'fizz', content: 'buzz'},
    ]} />, 
);

export default App;
```

###### App Render output

```html
<div class="accordion-foo-bar">
    <div class="accordion_panel">
        <div class="accordion_title">foo</div>
        <div class="accordion_content">bar</div>
    </div>
    <div class="accordion_panel">
        <div class="accordion_title">fizz</div>
        <div class="accordion_content">buzz</div>
    </div>
</div>
```

### Adding Interactions

> See the [Interactions](Interactions) page to learn how to add interactions

## Installation/Setup

```
npm install --save @onenexus/lucid
```

###### Basic

```js
import { Module, Component } from '@onenexus/lucid';
```

###### Complete

```js
import { 
    Module, 
    Group, 
    Wrapper, 
    Component,
    SubComponent
} from '@onenexus/lucid';
```

> Tip: make `Module` and `Component` globally available so all your React components can easily utilise them

## API

* [`<Module>`](Module)
* [`<Wrapper>`](Wrapper)
* [`<Group>`](Group)
* [`<Component>`](Component)
* [`<SubComponent>`](SubComponent)