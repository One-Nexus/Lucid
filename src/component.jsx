import React from 'react';

import getHtmlProps from './utilities/getHtmlProps';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import generateClasses from './utilities/generateClasses';
import renderModifiers from './utilities/renderModifiers';
import handleMount from './utilities/handleMount';
import handleUpdate from './utilities/handleUpdate';

import { ModuleContext } from './module.jsx';

const ComponentContext = React.createContext();

/**
 * Render a Synergy component
 */
export default class Component extends React.Component {
    constructor(props) {
        super(props);

        this.REF = React.createRef();
        this.styleParser = props.styleParser || Synergy.styleParser;
    }

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

    componentDidMount() {
        handleMount(this.REF.current, this.props, this.context, this.styleParser);
    }

    componentDidUpdate() {
        handleUpdate(this.REF.current, this.props, this.context);

        if (this.REF.current.repaint) {
            this.REF.current.repaint();
        }
    }

    renderTag(props, context, subComponent) {
        const { modifierGlue, componentGlue }  = context;
        const module = props.module || context.module;
        const propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CSSClassProps), modifierGlue);
        const getContextModifiers = getModifiersFromProps(context.props && context.props[props.name], Synergy.CSSClassProps);
        const contextModifiers = renderModifiers(getContextModifiers, modifierGlue);
        const passedModifiers = renderModifiers(props.modifiers, modifierGlue);
        const modifiers = propModifiers + passedModifiers + contextModifiers;
        const eventHandlers = this.getEventHandlers([ props, context.config[props.name] ? context.config[props.name] : {} ]);
        const Tag = (props.href && 'a') || props.component || props.tag || 'div';

        const contextValues = {
            ...context, props: { ...this.props, ...context.props }
        }

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

                    ref={this.REF}
                    className={classes}
                    data-component={props.name.constructor === Array ? props.name[0] : props.name}

                    {...this.props.componentProps}
                >
                    {props.content || props.children}
                </Tag>
            </ComponentContext.Provider>
        )
    }

    static contextType = ComponentContext;

    render() {
        return (
            <ModuleContext.Consumer>
                {(context) => {
                    return this.renderTag(this.props, { ...context, ...this.context }, !!this.props.subComponent);
                }}
            </ModuleContext.Consumer>
        );
    }
}

export const SubComponent = props => (
    <Component subComponent={true} {...props}>{props.children}</Component>
);