import React from 'react';
import PropTypes from 'prop-types';
import HTMLTags from 'html-tags';

import getHtmlProps from './utilities/getHtmlProps';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import getModulesFromProps from './utilities/getModulesFromProps';
import getParam from './utilities/getParam';
import renderModifiers from './utilities/renderModifiers';
import refHandler from './utilities/refHandler';

/**
 * Render a Synergy component
 *
 * @extends React.Component
 */
export default class Component extends React.Component {

    constructor(props, context) {
        super(props, context);

        const styleParser = props.styleParser || Synergy.styleParser;
        const config = context.config || {};
        const propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CssClassProps));
        const contextModifiers = renderModifiers(getModifiersFromProps(context.props && context.props[props.name], Synergy.CssClassProps));
        const passedModifiers = renderModifiers(props.modifiers);

        this.componentGlue = config.componentGlue || (window.Synergy && Synergy.componentGlue) || '_';
        this.modifierGlue  = config.modifierGlue  || (window.Synergy && Synergy.modifierGlue)  || '-';
        this.tag = props.component || props.tag || (HTMLTags.includes(props.name) ? props.name : 'div');
        this.module = props.module || context.module;
        this.modifiers = propModifiers + passedModifiers + contextModifiers;
        this.classes = getModulesFromProps(props, props.className ? ' ' + props.className : '', this.modifierGlue);
        this.selector = `${this.module + this.componentGlue + props.name + this.modifiers + this.classes}`.replace(/,/g, this.componentGlue);
        this.ref = node => refHandler(node, props, styleParser, this.module);

        this.getEventHandlers([ props, config[props.name] ? config[props.name] : {} ]);

        if (props.href) this.tag = 'a';
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

            if (key.indexOf('modifier') === 0 || key.indexOf('-') === 0) {
                if (this.props.modifiers && this.props.modifiers.includes(getParam(key))) {
                    this.getEventHandlers(value);
                }
            }
        }
    }

    isNested() {
        try {
            return this.constructor.name === this.props.children.type.name;
        } catch (error) {
            return false;
        }
    }

    getChildContext() {
        return {
            component: this.props.name
        };
    }

    renderTag(props) {
        return (
            <this.tag 
                {...getHtmlProps(props)}
                {...this.eventHandlers}

                ref={this.ref}
                className={this.selector}
                data-component={props.name}
            >

                {props.children}
            </this.tag>
        )
    }

    render() {
        if (this.isNested()) {
            const parentKeys = Object.keys(this.props).sort();
            const childKeys = Object.keys(this.props.children.props).sort();
            const sameAsParent = this.props.name === this.props.children.props.name;

            if (JSON.stringify(parentKeys) === JSON.stringify(childKeys) && sameAsParent) {
                return this.props.children;
            }

            return this.renderTag(this.props);
        } 

        else return this.renderTag(this.props);
    }
}

Component.contextTypes = {
    module: PropTypes.string,
    modifiers: PropTypes.array,
    component: PropTypes.string,
    subComponent: PropTypes.array,
    config: PropTypes.object,
    props: PropTypes.object
};

Component.childContextTypes = {
    component: PropTypes.string
};

export class SubComponent extends Component {
    constructor(props, context) {
        super(props, context);

        let namespace = `${context.component + this.componentGlue + props.name}`;

        if (context.subComponent) {
            namespace = `${namespace + this.componentGlue + context.subComponent.join(this.componentGlue)}`;
        }

        this.selector = `${this.module + this.componentGlue + namespace + this.modifiers + this.classes}`;
    }

    getChildContext() {
        let subComponents = this.context.subComponent || [];

        subComponents.push(this.props.name);

        return {
            subComponent: subComponents
        };
    }

    render() {
        return this.renderTag(this.props);
    }
}

SubComponent.childContextTypes = {
    subComponent: PropTypes.array
};