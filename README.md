[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/One-Nexus/Lucid/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/One-Nexus/Lucid.svg?branch=master)](https://travis-ci.com/One-Nexus/Lucid)
[![npm version](https://badge.fury.io/js/%40onenexus%2Flucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)
[![npm downloads](https://img.shields.io/npm/dm/@onenexus/lucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)

> No nonsense JavaScript styling for React DOM projects

<img src="https://edmundreed.com/projects/lucid/banner.png" /><br>

* [Overview](#overview)
* [Installation/Setup](#installationsetup)
* [API](#api)

## Overview

Lucid is a collection of React Components that should be used to create your [Presentational Components](https://learn.co/lessons/react-presentation-components). Lucid uses [*state*](https://github.com/One-Nexus/Lucid/wiki/State) and [*context*](https://github.com/One-Nexus/Lucid/wiki/Context) to determine which styles to apply to a given [Element](https://github.com/One-Nexus/Synergy/wiki/Modules,-Components-and-Modifiers#elements); it maps CSS keys from your styles Object to [Components](https://github.com/One-Nexus/Lucid/wiki/Component) with a matching `name` prop (with top level keys applying to the parent [Module](https://github.com/One-Nexus/Lucid/wiki/Module)), avoiding the need for class names.

Checkout this example to see how Lucid can be used to create a simple UI accordion that is both styled and functional:

> [View a live demo of this example on CodeSandbox](https://codesandbox.io/s/lucid-demo-3lgoo)

```jsx
import React, { useState } from 'react';
import { Module, Component } from '@onenexus/lucid';

const styles = () => ({
  heading: ({ context, state }) => ({
    backgroundColor: 'red',
    
    ...(context.panel.open && {
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
    display: context.panel.open ? 'block' : 'none'
  })
});

const Accordion = ({ panels, ...props }) => {
  const [current, toggle] = useState(0);

  return (
    <Module name='Accordion' styles={styles} { ...props }>
      {panels.map(({ heading, content }, i) => (
        <Component name='panel' open={i === current}>
          <Component name='heading' onClick={() => toggle(i === current ? -1 : i)}>
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

> For a more fleshed out example, see [the demo from the Synergy Wiki](https://github.com/One-Nexus/Synergy/wiki#60-second-accordion-from-scratch)

### Features

* Built to prioritise Developer Experience (DX)
* It's just JavaScript; no CSS selectors as object keys etc...
* No CSS classes or `className` props required
* Improve the readability of your source code
* [Improve the readability of your production code](https://github.com/One-Nexus/Lucid/wiki/DOM-Rendering#overview) ([why is this important?](https://twitter.com/ESR360/status/1151879057409265666))
* [Media Queries](https://github.com/One-Nexus/Lucid/wiki/Styles#media-queries)
* [Pseudo States/Elements (`:hover`, `:focus`, `:before`, `:after`)](https://github.com/One-Nexus/Lucid/wiki/Styles#pseudo-stateselements)
* Based off [state](https://github.com/One-Nexus/Lucid/wiki/State) and [context](https://github.com/One-Nexus/Lucid/wiki/Context) - not only the most fiendly API but the most flexible
* Inherent flexible nature supports themes, configuration etc without dedicated APIs ([though they are provided](https://github.com/One-Nexus/Lucid/wiki/Config))
* Automagically identify [cosmetic style properties](https://github.com/One-Nexus/Lucid/wiki/Config#retreiving-cosmetic-styles-from-config) from [configuration/state/props](https://github.com/One-Nexus/Lucid/wiki/Styles#pass-array-of-styles)

### How it Works

* Utilises React's context API under the hood
* Singular styles object (or function that returns an object) passed to `<Module>`
* Styles are mapped to child Components by matching keys with `<Component>` `name` props
* Parent props/state are [available as `context`](https://github.com/One-Nexus/Lucid/wiki/Context), self props/state are [available as `state`](hhttps://github.com/One-Nexus/Lucid/wiki/Statee)

### NOT CSS-in-JS!

Whilst Lucid _is_ a JavaScript tool for authoring styles, we don't consider it to be "CSS-in-JS". CSS is a language with its own rules and concepts such as classes, selectors, pseudo-elements, cascading, etc. Lucid is not a tool for translating CSS paradigms into JavaScript (unlike other solutions) - it is a tool for applying CSS _properties_ to your React Components using a super friendly API. It results in inline-styles being applied to the DOM - Lucid doesn't generate any CSS.

## Installation/Setup/Usage

```
npm install --save @onenexus/lucid
```

### Basic

```js
import { Module, Component } from '@onenexus/lucid';
```

* [`<Module>`](https://github.com/One-Nexus/Lucid/wiki/Module)
* [`<Component>`](https://github.com/One-Nexus/Lucid/wiki/Component)

### All Lucid Components

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

* [`<Module>`](https://github.com/One-Nexus/Lucid/wiki/Module)
* [`<Component>`](https://github.com/One-Nexus/Lucid/wiki/Component)
* [`<SubComponent>`](https://github.com/One-Nexus/Lucid/wiki/SubComponent)
* [`<Wrapper>`](https://github.com/One-Nexus/Lucid/wiki/Wrapper)
* [`<Group>`](https://github.com/One-Nexus/Lucid/wiki/Group)
* [`<Provider>`](https://github.com/One-Nexus/Lucid/wiki/Provider)
* [`styled`](https://github.com/One-Nexus/Lucid/wiki/styled)

### Lucid Hooks

```js
import { useConfig, useTheme, useUtils } from '@onenexus/lucid';
```

* [`useConfig`](https://github.com/One-Nexus/Lucid/wiki/Config#using-hooks-config-access)
* [`useTheme`](https://github.com/One-Nexus/Lucid/wiki/Themes#usetheme-hook)
* [`useUtils`](https://github.com/One-Nexus/Lucid/wiki/Utils#using-useutils-hook)

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