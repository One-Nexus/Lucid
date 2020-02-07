[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/One-Nexus/Lucid/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/One-Nexus/Lucid.svg?branch=master)](https://travis-ci.com/One-Nexus/Lucid)
[![npm version](https://badge.fury.io/js/%40onenexus%2Flucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)
[![npm downloads](https://img.shields.io/npm/dm/@onenexus/lucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)

> No nonsense JavaScript styling for React DOM projects

<img src="http://www.onenexus.io/lucid/images/banner.png" /><br>

* [Overview](#overview)
* [Installation/Setup](#installationsetup)
* [API](#api)

## Overview

Lucid is a collection of React Components that should be used to create your [Presentational Components](https://learn.co/lessons/react-presentation-components). Lucid uses *state* and *context* to determine which styles to apply to a given component; it maps keys from your styles object to components with a matching `name` prop, avoiding the need for class names. 

Checkout this example to see how Lucid can be used to create a simple UI accordion:

```jsx
import React, { useState } from 'react';
import { Module, Component } from '@onenexus/lucid';

const styles = () => ({
  heading: ({ context, state }) => ({
    backgroundColor: 'red',
    
    ...(context.panel.isOpen && {
      backgroundColor: 'blue'
    }),
    
    ':hover': {
      backgroundColor: 'purple'
    },

    // ...or alternatively:
    ...(state.isHovered && {
      backgroundColor: 'purple'
    })
  }),

  content: ({ context }) => ({
    display: context.panel.isOpen ? 'block' : 'none'
  })
});

const Accordion = ({ panels, ...props }) => {
  const [activeIndex, toggle] = useState(0);

  return (
    <Module name='Accordion' styles={styles} { ...props }>
      {panels.map(({ heading, content }, index) => (
        <Component name='panel' isOpen={index === activeIndex}>
          <Component name='heading' onClick={() => toggle(index === activeIndex ? -1 : index)}>
            {heading}
          </Component>
          <Component name='content' content={content} />
        </Component>
      ))}
    </Module>
  );
}

export default Accordion;
```

> [View this example on CodeSandbox](https://codesandbox.io/s/fervent-pine-3lgoo)

### Features

* Built to prioritise Developer Experience (DX)
* It's just JavaScript; no CSS selectors as object keys etc...
* No CSS classes or `className` props required
* Improve the readability of your source code
* Improve the readability of your production code ([why is this important?](https://twitter.com/ESR360/status/1151879057409265666))
* [Media Queries](https://github.com/One-Nexus/Lucid/wiki/Styles#media-queries)
* [Pseudo States/Elements (`:hover`, `:focus`, `:before`, `:after`)](https://github.com/One-Nexus/Lucid/wiki/Styles#pseudo-stateselements)
* Based off state and context - not only the most fiendly API but the most flexible
* Inherent flexible nature supports themes, configuration etc without dedicated APIs ([though they are provided](https://github.com/One-Nexus/Lucid/wiki/Config))
* Automagically identify [cosmetic style properties](https://github.com/One-Nexus/Lucid/wiki/Config#retreiving-cosmetic-styles-from-config) from [configuration/state/props](https://github.com/One-Nexus/Lucid/wiki/Styles#pass-array-of-styles)

### How it Works

* Utilises React's context API under the hood
* Singular styles object (or function that returns an object) passed to `<Module>`
* Styles are mapped to child components by matching keys with `<Component>` `name` props
* Parent props/state are [available as `context`](https://github.com/One-Nexus/Lucid/wiki/Context), self props/state are [available as `state`](hhttps://github.com/One-Nexus/Lucid/wiki/Statee)

### NOT CSS-in-JS!

Whilst Lucid _is_ a JavaScript tool for authoring styles, we don't consider it to be "CSS-in-JS". CSS is a language with its own rules and concepts such as classes, selectors, pseudo-elements, cascading, etc. Lucid is not a tool for translating CSS paradigms into JavaScript (unlike other solutions) - it is a tool for applying CSS _properties_ to your React components using a super friendly API. It results in inline-styles being applied to the DOM - Lucid doesn't generate any CSS.

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
  Component,
  SubComponent,
  Wrapper,
  Group,
  Provider
} from '@onenexus/lucid';
```

## API

* [`<Module>`](https://github.com/One-Nexus/Lucid/wiki/Module)
* [`<Component>`](https://github.com/One-Nexus/Lucid/wiki/Component)
* [`<SubComponent>`](https://github.com/One-Nexus/Lucid/wiki/SubComponent)
* [`<Wrapper>`](https://github.com/One-Nexus/Lucid/wiki/Wrapper)
* [`<Group>`](https://github.com/One-Nexus/Lucid/wiki/Group)
* [`<Provider>`](https://github.com/One-Nexus/Lucid/wiki/Provider)
* [`styled`](https://github.com/One-Nexus/Lucid/wiki/styled)

---

<a href="https://github.com/ESR360">
  <img src="http://edmundreed.com/assets/images/github.gif?v=1" width="230px" />
</a>
<a href="https://twitter.com/ESR360">
  <img src="http://edmundreed.com/assets/images/twitter.gif?v=1" width="230px" />
</a>
<a href="https://www.instagram.com/edmund_reed/">
  <img src="http://edmundreed.com/assets/images/insta.png" width="230px" />
</a>