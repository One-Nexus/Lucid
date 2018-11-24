import React from 'react';
import HTMLTags from 'html-tags';

import getHtmlProps from './utilities/getHtmlProps';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import getModulesFromProps from './utilities/getModulesFromProps';
import renderModifiers from './utilities/renderModifiers';
import refHandler from './utilities/refHandler';

import { ModuleContext } from './module';

const ComponentContext = React.createContext({
    component: ''
});

/**
 * Render a Synergy component
 */
export default class Component extends React.Component {
    generateSelector(name) {
        return `${this.module + this.componentGlue + name + this.modifiers}`;
    }

    getEventHandlers(properties) {
        this.eventHandlers = this.eventHandlers || {};

        if (properties.constructor === Array) {
            properties.forEach(group => this.getEventHandlers(group));
        }

        else for (var key in properties) {
            const value = properties[key];

            if (Object.keys(window).includes(key.toLowerCase())) {
                if (typeof value === 'function') {
                    this.eventHandlers[key] = value;
                }
            }
        }
    }

    renderTag(props, Provider, context, subComponent) {
        const styleParser = props.styleParser || Synergy.styleParser;
        const config = context.config || {};
        const propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CssClassProps));
        const contextModifiers = renderModifiers(getModifiersFromProps(context.props && context.props[props.name], Synergy.CssClassProps));
        const passedModifiers = renderModifiers(props.modifiers);

        this.componentGlue = context.ui['component-glue'];
        this.modifierGlue  = context.ui['component-glue'];

        this.tag = props.component || props.tag || (HTMLTags.includes(props.name) ? props.name : 'div');
        this.module = props.module || context.module;
        this.modifiers = propModifiers + passedModifiers + contextModifiers;
        this.classes = getModulesFromProps(props, props.className ? ' ' + props.className : '', this.modifierGlue);
        this.selector = '';

        if (props.name instanceof Array) {
            props.name.forEach(name => this.selector = (this.selector ? this.selector + ' ' : '') + this.generateSelector(name));

            this.selector = this.selector + this.classes;
        } else {
            this.selector = this.generateSelector(props.name) + this.classes;
        }

        this.ref = node => refHandler(node, props, styleParser, false, context.ui);

        this.getEventHandlers([ props, config[props.name] ? config[props.name] : {} ]);

        if (props.href) this.tag = 'a';

        if (subComponent) {
            context.subComponent = context.subComponent || [props.name];

            const subComponents = (context.subComponent ? context.subComponent.join(this.componentGlue) : '');
            const namespace = `${context.component + this.componentGlue + subComponents}`;
    
            this.selector = `${this.module + this.componentGlue + namespace + this.modifiers + this.classes}`;
        }

        return (
            <Provider value={context}>
                <this.tag 
                    {...getHtmlProps(props)}
                    {...this.eventHandlers}

                    ref={this.ref}
                    className={this.selector}
                    data-component={props.name.constructor === Array ? props.name[0] : props.name}
                >
                    {props.children}
                </this.tag>
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
                    let subComponents = context.subComponent || [];

                    subComponents.push(this.props.name);

                    if (context.subComponent) {
                        return (
                            <SubComponentContext.Consumer>
                                {(subComponentContext) => {
                                    Object.assign(context, subComponentContext);

                                    return (
                                        <SubComponentContext.Provider value={{ subComponent: subComponents, ...context }}>
                                            {this.renderTag(this.props, ComponentContext.Provider, context, true)}
                                        </SubComponentContext.Provider>
                                    )
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