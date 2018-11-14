import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import HTMLTags from 'html-tags';
import deepExtend from 'deep-extend';

import getHtmlProps from './utilities/getHtmlProps';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import getModulesFromProps from './utilities/getModulesFromProps';
import renderModifiers from './utilities/renderModifiers';
import refHandler from './utilities/refHandler';

/**
 * Used for generating unique module ID's
 */
let increment = 1;

/**
 * Render a Synergy module
 *
 * @extends React.Component
 */
export default class Module extends React.Component {

    constructor(props, context) {
        super(props, context);

        increment++;

        const styleParser = props.styleParser || Synergy.styleParser;
        const modifierGlue = props.modifierGlue || (window.Synergy && Synergy.modifierGlue) || '-';
        const propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CssClassProps));
        const passedModifiers = renderModifiers(props.modifiers);
        const modifiers = propModifiers + passedModifiers;
        const classes = props.className ? ' ' + props.className : '';

        let config = props.config || {};

        if (window[props.name]) {
            config = Module.config(window[props.name].config, config);
        }

        this.ui = props.ui || window.ui;
        this.namespace = config.name || props.name;
        this.ref = node => refHandler(node, props, styleParser, true, this.ui, config);
        this.id = (props.before || props.after) && !props.id ? `synergy-module-${increment}` : props.id;
        this.tag = props.component || props.tag || (HTMLTags.includes(this.namespace) ? this.namespace : 'div');
        this.classNames = getModulesFromProps(props, this.namespace + modifiers + classes, modifierGlue);

        if (Synergy.CssClassProps) Synergy.CssClassProps.forEach(prop => {
            if (Object.keys(props).includes(prop)) {
                this.classNames = this.classNames + ' ' + prop
            }
        });
    }

    getChildContext() {
        return { 
            module: this.namespace,
            modifiers: this.props.modifiers,
            props: this.props,
            ui: this.ui
        };
    }

    componentDidMount() {
        const _module = Synergy.modules ? Synergy.modules[this.namespace] : null;

        if (_module && _module.methods) {
            if (_module.methods.init) {
                _module.methods.init(ReactDOM.findDOMNode(this), this.config);
            }
        }
    }

    getEventHandlers(properties) {
        let eventHandlers = {};

        for (let prop in properties) {
            if (Object.keys(window).includes(prop.toLowerCase())) {
                if (prop !== 'name') {
                    eventHandlers[prop] = properties[prop];
                }
            }
        }

        return eventHandlers;
    }

    getDataAttributes(properties) {
        let dataAttributes = {};

        for (let prop in properties) {
            if (prop.indexOf('data-') === 0) {
                dataAttributes[prop] = properties[prop];
            }
        }

        return dataAttributes;
    }

    render() {
        return (
            <React.Fragment>
                { this.props.before && this.props.before(() => document.getElementById(this.id)) }

                <this.tag
                    id={this.id}
                    className={this.classNames}
                    data-module={this.namespace}
                    ref={this.ref}

                    {...getHtmlProps(this.props)}
                    {...this.getDataAttributes(this.props)}
                    {...this.getEventHandlers(this.props)}
                    {...this.props.componentProps}
                >
                    {this.props.children}
                </this.tag>

                { this.props.after && this.props.after(() => document.getElementById(this.id)) }
            </React.Fragment>
        );
    }
}

Module.config = (...params) => deepExtend({}, ...params);

Module.childContextTypes = {
    module: PropTypes.string,
    ui: PropTypes.object,
    modifiers: PropTypes.array,
    config: PropTypes.object,
    props: PropTypes.object
};

export class Wrapper extends Module {
    constructor(props, context) {
        super(props, context);

        this.module = props.module;
        this.namespace = props.name || 'wrapper';

        if (!this.module) {
            if (props.children.length) {
                this.module = props.children[0].type.name.toLowerCase();
            } else {
                this.module = props.children.type.name.toLowerCase();
            }
        }

        this.dynamicProps = {
            [this.module]: true
        }
    }

    render() {
        return (
            <Module name={this.namespace} {...this.dynamicProps} {...this.props}>{this.props.children}</Module>
        )
    }
}

export class Group extends Module {
    render() {
        return (
            <Wrapper name='group' {...this.props}>{this.props.children}</Wrapper>
        )
    }
}