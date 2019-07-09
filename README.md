[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/One-Nexus/Lucid/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/One-Nexus/Lucid.svg?branch=master)](https://travis-ci.com/One-Nexus/Lucid)
[![npm version](https://badge.fury.io/js/%40onenexus%2Flucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)
[![npm downloads](https://img.shields.io/npm/dm/@onenexus/lucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)

> No nonsense JavaScript styling for React DOM projects based off state and context

<img height="66px" src="http://www.onenexus.io/lucid/images/lucid-logo.png" /><br>

* [Overview](#overview)
* [Installation/Setup](#installationsetup)
* [API](#api)

## Overview

```jsx
import React, { useState } from 'react';
import { Module, Component } from '@onenexus/lucid';

const styles = () => ({
  heading: ({ context, state }) => ({
    backgroundColor: 'red',
    
    ...(context.isOpen && {
      backgroundColor: 'blue'
    }),
    
    ...(state.isHovered && {
      backgroundColor: 'blue'
    }),
  }),

  content: ({ context }) => ({
    display: context.isOpen ? 'block' : 'none'
  })
});

const Accordion = ({ panels }) => (
  <Module styles={styles}>
    {panels.map(({ heading, content }) => {
      const [isOpen, toggle] = useState(false);

      return (
        <Component name='panel' isOpen={isOpen}>
          <Component name='heading' onClick={() => toggle(!isOpen)}>
            {heading}
          </Component>
          <Component name='content'>
            {content}
          </Component>
        </Component>
      );
    })}
  </Module>
);

export default Accordion;
```

### Features

* Most friendly CSS-in-JS API on the market
* Built to prioritise DX
* It's just JavaScript; no nonsense CSS selectors as object keys etc.
* Improve the readability of your code
* Low barrier to entry - if you know React OR Sass, you can easily pick this up
* Based off state and context - not only the most fiendly API but the most flexible
* Inherent flexible nature supports themes, configuration etc without dedicated APIs (though they are provided for DX purposes)
* Automagically identify cosmetic style properties from configuration/state/props

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
  Component,
  SubComponent,
  Group,
  Wrapper
} from '@onenexus/lucid';
```

## API

* [`<Module>`](https://github.com/One-Nexus/Lucid/wiki/Module)
* [`<Component>`](https://github.com/One-Nexus/Lucid/wiki/Component)
* [`<SubComponent>`](https://github.com/One-Nexus/Lucid/wiki/SubComponent)
* [`<Wrapper>`](https://github.com/One-Nexus/Lucid/wiki/Wrapper)
* [`<Group>`](https://github.com/One-Nexus/Lucid/wiki/Group)

---

<a href="https://twitter.com/ESR360">
  <img src="http://edmundreed.com/assets/images/twitter.gif?v=1" width="250px" />
</a>
<a href="https://github.com/ESR360">
  <img src="http://edmundreed.com/assets/images/github.gif?v=1" width="250px" />
</a>