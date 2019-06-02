[![Build Status](https://travis-ci.com/One-Nexus/Lucid.svg?branch=master)](https://travis-ci.com/One-Nexus/Lucid)

> A set of higher-order React components for rendering Synergy modules/BEM DOM elements

<img height="66px" src="http://www.onenexus.io/lucid/images/lucid-logo.png" /><br>

* [Overview](#overview)
* [Installation/Setup](#installationsetup)
* [API](#api)

## Overview

* Use for [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
* Use for rendering [Synergy Modules](https://github.com/One-Nexus/Synergy/wiki/About-Synergy)
* Use for rendering [BEM DOM elements](https://github.com/One-Nexus/Lucid/wiki/Working-With-BEM)
* Adds new [properties and methods](https://github.com/One-Nexus/Lucid/wiki/Interactions#new-element-prototype-propertiesmethods) to Prototype of rendered DOM element
* Naturally enforces a better UI architecture

###### Example

> This example uses [React hooks](https://reactjs.org/docs/hooks-overview.html#state-hook) for functionality

```jsx
import React, { useState }  from 'react';
import { Module, Component } from '@onenexus/lucid';

const Accordion = ({ name = 'accordion', panels, modifiers }) => {
  const [activePanel, setActivePanel] = useState(0);

  return (
    <Module name={name} modifiers={modifiers}>
      {panels.map(({ title, content }, index) => {
        const isActive = (activePanel === index);

        return (
          <Component name='panel' modifiers={[isActive ? 'active' : '']}>
            <Component name='title' onClick={() => setActivePanel(index)}>
              {title}
            </Component>

            <Component name='content'>
              {content}
            </Component>
          </Component>
        )
      })}
    </Module>
  )
};

const App = () => (
  <Accordion modifiers={['foo', 'bar']} panels={[
    { title: 'foo', content: 'bar' },
    { title: 'fizz', content: 'buzz' }
  ]} />
);

export default App;
```

###### App Render output

```html
<div class="accordion-foo-bar">
  <div class="accordion_panel-active">
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

The above example uses React hoooks for interactive functionality. For a more comprehensive look into adding functioanality, see the [Interactions](Interactions) page.

## Installation/Setup

> Using BEM? Checkout the [Working With BEM](https://github.com/One-Nexus/Lucid/wiki/Working-With-BEM) page

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

> Using BEM? Checkout the [Working With BEM page](https://github.com/One-Nexus/Lucid/wiki/Working-With-BEM)

## API

* [`<Module>`](Module)
* [`<Wrapper>`](Wrapper)
* [`<Group>`](Group)
* [`<Component>`](Component)
* [`<SubComponent>`](SubComponent)

---

<a href="https://twitter.com/ESR360">
    <img src="http://edmundreed.com/assets/images/twitter.gif?v=1" width="250px" />
</a>
<a href="https://github.com/ESR360">
    <img src="http://edmundreed.com/assets/images/github.gif?v=1" width="250px" />
</a>