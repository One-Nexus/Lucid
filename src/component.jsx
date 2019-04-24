import React from 'react';
import HTMLTags from 'html-tags';

import getHtmlProps from './utilities/getHtmlProps';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import generateClasses from './utilities/generateClasses';
import renderModifiers from './utilities/renderModifiers';
import refHandler from './utilities/refHandler';

import { ModuleContext } from './module.jsx';

const ComponentContext = React.createContext();

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

    renderTag(props, context, subComponent) {
        const { modifierGlue, componentGlue }  = context;
        const module = props.module || context.module;
        const propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CssClassProps), modifierGlue);
        const getContextModifiers = getModifiersFromProps(context.props && context.props[props.name], Synergy.CssClassProps);
        const contextModifiers = renderModifiers(getContextModifiers, modifierGlue);
        const passedModifiers = renderModifiers(props.modifiers, modifierGlue);
        const modifiers = propModifiers + passedModifiers + contextModifiers;
        const eventHandlers = this.getEventHandlers([ props, context.config[props.name] ? context.config[props.name] : {} ]);
        const Tag = (props.href && 'a') || props.component || props.tag || (HTMLTags.includes(props.name) ? props.name : 'div');
        const ref = node => refHandler(node, props, context.styleParser, false, context.ui);

        const contextValues = {
            component: context.component
        };

        // if (props.name instanceof Array) {
        //     @TODO
        // }

        let namespace;

        if (subComponent) {
            contextValues.subComponent = [...(context.subComponent || []), props.name];

            const subComponents = (contextValues.subComponent.length ? contextValues.subComponent.join(componentGlue) : '');

            namespace = `${module + componentGlue + (context.component || props.name) + componentGlue + subComponents}`;
        } 
        else {
            contextValues.component = props.name;

            namespace = module + componentGlue + props.name;
        }

        let classes = generateClasses({
            props,
            namespace,
            modifiers,
            classes: props.className ? props.className : '', 
            modifierGlue,
            componentGlue,
            multipleClasses: context.multipleClasses
        });
    
        return (
            <ComponentContext.Provider value={contextValues}>
                <Tag
                    {...getHtmlProps(props)}
                    {...eventHandlers}

                    ref={ref}
                    className={classes}
                    data-component={props.name.constructor === Array ? props.name[0] : props.name}

                    {...this.props.componentProps}
                >
                    {props.children}
                </Tag>
            </ComponentContext.Provider>
        )
    }

    render() {
        return (
            <ModuleContext.Consumer>
                {(context) => {
                    if (this.props.subComponent) {
                        return (
                            <ComponentContext.Consumer>
                                {(componentContext) => {
                                    return this.renderTag(this.props, { ...context, ...componentContext }, true)
                                }}
                            </ComponentContext.Consumer>
                        )
                    }

                    return this.renderTag(this.props, context)
                }}
            </ModuleContext.Consumer>
        )
    }
}

export const SubComponent = props => (
    <Component subComponent={true} {...props}>{props.children}</Component>
);