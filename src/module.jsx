import React from 'react';

import getHtmlProps from './utilities/getHtmlProps';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import generateClasses from './utilities/generateClasses';
import renderModifiers from './utilities/renderModifiers';
import refHandler from './utilities/refHandler';

// spoof env process to assist bundle size
if (typeof process === 'undefined') window.process = { env: {} };

/** Used for generating unique module ID's */
let increment = 1;

/** Create a context object */
const ModuleContext = React.createContext();

export { ModuleContext };

/**
 * Render a Synergy module
 *
 * @extends React.Component
 */
export default class Module extends React.Component {
    constructor(props) {
        super(props);

        increment++;

        this.ui = props.ui || window.ui;
        this.REF = React.createRef();
        this.styleParser = props.styleParser || Synergy.styleParser;
        this.config = props.config || {};

        if (window[props.name] && window[props.name].config) {
            this.config = Module.config(window[props.name].config, this.config);
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

    componentDidMount() {
        refHandler(this.REF.current, this.props, this.styleParser, true, this.ui, this.config);
    }

    componentDidUpdate() {
        if (this.REF.current.repaint) {
            this.REF.current.repaint();
        }
    }

    static config = (...params) => {
        // `process` and `require` are exploited to help reduce bundle size
        if (process.env.SYNERGY) {
            return Synergy.config({}, ...params);
        } 
        else if (typeof Synergy !== 'undefined' && typeof Synergy.config === 'function') {
            return Synergy.config({}, ...params);
        } 
        else {
            return require('deep-extend')({}, ...params);
        }
    };

    static child = props => {
        const childProps = Object.assign({}, props);
    
        delete childProps.children;

        let config = props.config || {};

        if (window[props.name]) {
            config = Module.config(window[props.name].config, config);
        }

        return React.Children.map(props.children, child => React.cloneElement(child, { 
            context: childProps,
            config: config
        }));
    }

    render() {
        var Synergy = window.Synergy || {};

        const props = this.props;

        const modifierGlue = props.modifierGlue || Synergy.modifierGlue || '-';
        const componentGlue = props.componentGlue || Synergy.componentGlue || '_';
        const propModifiers = renderModifiers(getModifiersFromProps(props, Synergy.CSSClassProps), modifierGlue);
        const passedModifiers = renderModifiers(props.modifiers, modifierGlue);
        const modifiers = propModifiers + passedModifiers;
        const classes = props.className ? props.className : '';

        let multipleClasses = false;

        if (typeof Synergy.multipleClasses !== 'undefined') multipleClasses = Synergy.multipleClasses;
        if (typeof props.multipleClasses !== 'undefined') multipleClasses = props.multipleClasses;

        const namespace = this.config.name || props.name;
        const id = (props.before || props.after) && !props.id ? `synergy-module-${increment}` : props.id;
        const Tag = props.tag || 'div';

        let classNames = generateClasses({
            props, 
            namespace: namespace,
            modifiers,
            classes,
            modifierGlue,
            componentGlue,
            multipleClasses
        });

        if (Synergy.CSSClassProps) Synergy.CSSClassProps.forEach(prop => {
            if (Object.keys(props).includes(prop)) {
                classNames = classNames + ' ' + prop
            }
        });

        const contextValue = {
            ui: this.ui,
            styleParser: this.styleParser,
            modifierGlue,
            componentGlue,
            multipleClasses,
            config: this.config,
            module: namespace,
            props
        }
    
        return (
            <ModuleContext.Provider value={contextValue}>
                { props.before && props.before(() => document.getElementById(id)) }

                <Tag
                    id={id}
                    className={classNames}
                    data-module={namespace}
                    ref={this.REF}

                    {...getHtmlProps(props)}
                    {...this.getDataAttributes(props)}
                    {...this.getEventHandlers(props)}
                    {...props.componentProps}
                >
                    {props.content || props.children}
                </Tag>

                { props.after && props.after(() => document.getElementById(id)) }
            </ModuleContext.Provider>
        );
    }
}

export class Wrapper extends Module {
    constructor(props) {
        super(props);

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