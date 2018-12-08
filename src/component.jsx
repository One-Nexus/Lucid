import React from 'react';
import HTMLTags from 'html-tags';

import getHtmlProps from './utilities/getHtmlProps';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import getModulesFromProps from './utilities/getModulesFromProps';
import renderModifiers from './utilities/renderModifiers';
import refHandler from './utilities/refHandler';

import { ModuleContext } from './module.jsx';

const ComponentContext = React.createContext({
    component: ''
});

/**
 * Render a Synergy component
 */
export default class Component extends React.Component {
    getEventHandlers(properties, handlers = {}) {
        if (properties.constructor === Array) {
            properties.forEach(group => this.getEventHandlers(group, handlers));
        }

        else for (var key in properties) {
            const value = properties[key];

            if (Object.keys(window).includes(key.toLowerCase())) {
                if (typeof value === 'function') {
                    handlers[key] = value;
                }
            }
        }

        return handlers;
    }

    renderTag(props, Provider, context, subComponent) {
        const styleParser = props.styleParser || Synergy.styleParser;
        const componentGlue = context.ui['component-glue'];
        const modifierGlue  = context.ui['component-glue'];
        const config = context.config || {};
        const module = props.module || context.module;
        const propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CssClassProps));
        const contextModifiers = renderModifiers(getModifiersFromProps(context.props && context.props[props.name], Synergy.CssClassProps));
        const passedModifiers = renderModifiers(props.modifiers);
        const classes = getModulesFromProps(props, props.className ? ' ' + props.className : '', modifierGlue);
        const modifiers = propModifiers + passedModifiers + contextModifiers;
        const eventHandlers = this.getEventHandlers([ props, config[props.name] ? config[props.name] : {} ]);
        const Tag = (props.href && 'a') || props.component || props.tag || (HTMLTags.includes(props.name) ? props.name : 'div');
        const ref = node => refHandler(node, props, styleParser, false, context.ui);

        let selector = '';

        if (props.name instanceof Array) {
            props.name.forEach(name => selector = (selector ? selector + ' ' : '') + `${module + componentGlue + name + modifiers}`);

            selector = selector + classes;
        } else {
            selector = `${module + componentGlue + props.name + modifiers}` + classes;
        }

        if (subComponent) {
            context.subComponent = context.subComponent || [props.name];

            const subComponents = (context.subComponent ? context.subComponent.join(componentGlue) : '');
            const namespace = `${context.component + componentGlue + subComponents}`;
    
            selector = `${module + componentGlue + namespace + modifiers + classes}`;
        }

        return (
            <Provider value={context}>
                <Tag
                    {...getHtmlProps(props)}
                    {...eventHandlers}

                    ref={ref}
                    className={selector}
                    data-component={props.name.constructor === Array ? props.name[0] : props.name}
                >
                    {props.children}
                </Tag>
            </Provider>
        )
    }

    render() {
        return (
            <ModuleContext.Consumer>
                {(context) => this.renderTag(this.props, ComponentContext.Provider, { 
                    component: this.props.name, ...context 
                })}
            </ModuleContext.Consumer>
        )
    }
}

const SubComponentContext = React.createContext({
    subComponent: []
});

export class SubComponent extends Component {
    render() {
        return (
            <ComponentContext.Consumer>
                {(context) => {
                    context.subComponent = context.subComponent || [];

                    !context.subComponent.includes(this.props.name) && context.subComponent.push(this.props.name);

                    if (context.subComponent) {
                        return (
                            <SubComponentContext.Consumer>
                                {(subComponentContext) => {
                                    Object.assign(context, subComponentContext);

                                    return this.renderTag(this.props, SubComponentContext.Provider, context, true);
                                }}
                            </SubComponentContext.Consumer>
                        )
                    }

                    return this.renderTag(this.props, SubComponentContext.Provider, context, true);
                }}
            </ComponentContext.Consumer>
        );
    }
}