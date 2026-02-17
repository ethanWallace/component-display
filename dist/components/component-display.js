import { p as proxyCustomElement, H, h, a as Host } from './index.js';
import { r as removeUnwantedAttributes, a as assignLanguage } from './p-BbO8WzMW.js';
import { d as defineCustomElement$6 } from './p-Co_oV2ZN.js';
import { d as defineCustomElement$5 } from './p-BBv1qV94.js';
import { d as defineCustomElement$4 } from './p-D5m_FF6B.js';
import { d as defineCustomElement$3 } from './p-DqYSflOG.js';
import { d as defineCustomElement$2 } from './p-hC5x3iiW.js';

const I18N = {
  en: {
    tabsHeading: 'Component API',
    tabsAttributes: 'Attributes',
    tabsSlots: 'Slots',
    tabsEvents: 'Events',
    tabsA11y: 'Accessibility',
    attributeUpdateStatus: 'The attribute "{name}" has been updated in the component preview.',
    slotUpdateStatus: 'The component slot content for "{name}" has been updated in the component preview.',
    frameworkUpdateStatus: 'The code preview for "{name}" has been updated.',
  },
  fr: {
    tabsHeading: 'Component API (TODO FR)',
    tabsAttributes: 'Attributs',
    tabsSlots: 'Fentes',
    tabsEvents: 'Événements',
    tabsA11y: 'Accessibilité',
    attributeUpdateStatus: 'L\'attribut "{name}" a été mis à jour dans l\'aperçu du composant.',
    slotUpdateStatus: 'Le contenu de la fente du composant pour "{name}" a été mis à jour dans l\'aperçu du composant.',
    frameworkUpdateStatus: 'L\'aperçu du code pour "{name}" a été mis à jour.',
  },
};

const componentDisplayCss = "@layer default, display, code, tabs;\n\n@layer default {\n  :host {\n    display: block;\n\n    slot {\n      display: initial;\n    }\n  }\n}\n\n@layer tabs {\n  :host {\n    .hidden {\n      display: none;\n    }\n\n    #tabs {\n      [role='tablist'] {\n        border-block-end: var(--gcds-border-width-md) solid var(--gcds-border-default);\n\n        gcds-button[role='presentation']::part(button) {\n          border: var(--gcds-border-width-md) solid transparent;\n          margin: 0 var(--gcds-spacing-50) calc(var(--gcds-border-width-md) * -1);\n          text-decoration: underline currentColor var(--gcds-link-decoration-thickness);\n          text-underline-offset: var(--gcds-link-underline-offset);\n        }\n\n        gcds-button {\n          &:first-of-type[role='presentation']::part(button) {\n            margin-inline-start: 0;\n          }\n\n          &:hover:not(:focus)::part(button) {\n            background-color: var(--gcds-color-grayscale-50);\n            color: var(--gcds-link-hover);\n            text-decoration-thickness: var(--gcds-link-hover-decoration-thickness);\n          }\n        }\n\n        gcds-button.selected {\n          &::part(button) {\n            font-weight: var(--gcds-font-weights-bold);\n            text-decoration-color: transparent;\n            padding-block: var(--gcds-spacing-200);\n          }\n\n          &:not(:focus)::part(button) {\n            border-color: var(--gcds-border-default);\n            border-block-end-color: var(--gcds-color-grayscale-0);\n            border-end-end-radius: 0;\n            border-end-start-radius: 0;\n          }\n\n          &:hover {\n            pointer-events: none;\n          }\n        }\n      }\n\n      table {\n        width: 100%;\n        font: var(--gcds-font-text-small);\n        margin: var(--gcds-spacing-300) 0 0;\n        border-collapse: collapse;\n\n        @media only screen and (width < 48em) {\n          &:not(.axe-results-table) {\n            font: var(--gcds-font-text-small-mobile);\n\n            tr:has(th) {\n              display: none !important;\n            }\n\n            tr {\n              display: block;\n              margin-bottom: var(--gcds-spacing-200);\n              border-block-start: var(--gcds-border-width-sm) solid var(--gcds-border-default);\n            }\n\n            td {\n              display: flex;\n              padding: var(--gcds-spacing-100);\n\n              &::before {\n                content: attr(data-label);\n                font-weight: var(--gcds-font-weights-bold);\n                margin-inline-end: var(--gcds-spacing-100);\n              }\n            }\n          }\n        }\n\n        caption {\n          max-width: var(--gcds-text-character-limit);\n          caption-side: bottom;\n          text-align: left;\n          margin: var(--gcds-spacing-300) 0 0;\n        }\n\n        th,\n        td {\n          border-block-end: var(--gcds-border-width-sm) solid var(--gcds-border-default);\n          padding: var(--gcds-spacing-150) var(--gcds-spacing-225);\n          text-align: left;\n        }\n\n        gcds-input {\n          --gcds-input-margin: 0;\n        }\n\n        gcds-select {\n          --gcds-select-min-width-and-height: 100%;\n          --gcds-select-margin: 0;\n        }\n\n        &.attributes {\n          th,\n          td {\n            width: 25%;\n\n            @media only screen and (width < 48em) {\n              width: auto;\n            }\n          }\n        }\n        &.slots {\n          tr > td:nth-child(3) {\n            width: 50%;\n\n            @media only screen and (width < 48em) {\n              width: 100%;\n\n              gcds-textarea {\n                width: 100%;\n                padding-inline-end: var(--gcds-spacing-200);\n              }\n            }\n          }\n        }\n      }\n\n      .tabs--accessibility {\n        padding: var(--gcds-spacing-100);\n\n        gcds-button {\n          margin: var(--gcds-spacing-300) 0;\n        }\n      }\n    }\n  }\n}\n";

const ComponentDisplay$1 = /*@__PURE__*/ proxyCustomElement(class ComponentDisplay extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    get el() { return this; }
    displayElement;
    slotHistory = [];
    attributeObject;
    slotObject;
    eventObject;
    /* ---------------------------
     * Props + validation
     * --------------------------- */
    /*
     * Array to format attributes table
     */
    attrs;
    validateAttrs() {
        if (typeof this.attrs == 'object') {
            this.attributeObject = this.attrs;
        }
        else if (typeof this.attrs == 'string') {
            this.attributeObject = JSON.parse(this.attrs);
        }
    }
    /*
     * Array to format slots table
     */
    slots;
    validateSlots() {
        if (typeof this.slots == 'object') {
            this.slotObject = this.slots;
        }
        else if (typeof this.slots == 'string') {
            this.slotObject = JSON.parse(this.slots);
        }
        this.slotObject?.forEach(slot => {
            if (slot.name === 'default') {
                this.slotHistory[slot.name] = this.displayElement.innerHTML;
            }
            else {
                const el = this.displayElement.querySelector(`[slot="${slot.name}"]`);
                this.slotHistory[slot.name] = el ? removeUnwantedAttributes(el.outerHTML) : '';
            }
        });
    }
    /*
     * Array to events attributes table
     */
    events;
    validateEvents() {
        if (typeof this.events == 'object') {
            this.eventObject = this.events;
        }
        else if (typeof this.events == 'string') {
            this.eventObject = JSON.parse(this.events);
        }
    }
    /*
     * Enable accessibility tests using axe-core
     */
    accessibility = false;
    /*
     * Display landmark elements in iframe
     */
    landmarkDisplay = false;
    /*
     * Starting framework for code preview generation
     */
    framework = 'html';
    /* ---------------------------
     * State
     * --------------------------- */
    display = null;
    lang = 'en';
    codeSource = '';
    /* ---------------------------
     * Listeners
     * --------------------------- */
    attributeChangeListener(e) {
        if (e.target === this.el) {
            this.displayElement.setAttribute(e.detail.name, e.detail.value);
            this.updateCodePreview();
            this.updateStatus('attribute', e.detail.name);
        }
    }
    statusUpdateListener(e) {
        if (e.target === this.el) {
            this.updateStatus(e.detail.type, e.detail.name);
        }
    }
    slotValueChangeListener(e) {
        if (e.target === this.el) {
            this.slotHistory[e.detail.name] = e.detail.value;
            this.renderSlotContent();
            this.updateCodePreview();
            this.updateStatus('slot', e.detail.name);
        }
    }
    async keyDownListener(e) {
        if (this.el.contains(document.activeElement)) {
            if (this.el.shadowRoot.activeElement.getAttribute('role') === 'presentation' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
                e.preventDefault();
                const buttons = Array.from(this.el.shadowRoot.querySelectorAll('div[role="tablist"] gcds-button'));
                const currentIndex = buttons.findIndex(button => this.el.shadowRoot.activeElement === button);
                let newIndex;
                if (e.key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % buttons.length;
                }
                else if (e.key === 'ArrowLeft') {
                    newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                }
                buttons[newIndex].shadowRoot.querySelector('button').focus();
            }
        }
    }
    /* ---------------------------
     * Lifecycle
     * --------------------------- */
    async componentWillLoad() {
        // Define lang attribute
        this.lang = assignLanguage(this.el);
        this.displayElement = this.el.children[0];
        this.validateAttrs();
        this.validateSlots();
        this.validateEvents();
        this.updateCodePreview();
        // Set current tab display
        if (this.attributeObject || this.slotObject || this.eventObject || this.accessibility) {
            if (this.attrs) {
                this.setDisplay('attrs');
            }
            else if (this.slots) {
                this.setDisplay('slots');
            }
            else if (this.events) {
                this.setDisplay('events');
            }
            else if (this.accessibility) {
                this.setDisplay('a11y');
            }
        }
    }
    async componentDidLoad() {
        this.setDisplay(this.display);
        if (this.attributeObject || this.slotObject || this.eventObject || this.accessibility) {
            this.el.shadowRoot.querySelectorAll('div[role="tablist"] gcds-button').forEach(button => {
                button.shadowRoot.querySelector('button').setAttribute('role', 'tab');
                if (button.id === this.display) {
                    button.shadowRoot.querySelector('button').setAttribute('aria-selected', 'true');
                }
                else {
                    button.shadowRoot.querySelector('button').setAttribute('aria-selected', 'false');
                }
            });
        }
    }
    /* ---------------------------
     * Helpers
     * --------------------------- */
    // Add slot content to the component display
    renderSlotContent() {
        this.displayElement.innerHTML = '';
        Object.values(this.slotHistory).forEach(content => {
            this.displayElement.innerHTML += content;
        });
    }
    updateCodePreview() {
        this.codeSource = removeUnwantedAttributes(this.el.innerHTML);
    }
    setDisplay(tab) {
        this.display = tab;
        this.el.shadowRoot.querySelectorAll('div[role="tablist"] gcds-button').forEach(button => {
            if (button.id === tab) {
                button.shadowRoot.querySelector('button').setAttribute('aria-selected', 'true');
            }
            else {
                button.shadowRoot.querySelector('button').setAttribute('aria-selected', 'false');
            }
        });
    }
    updateStatus(type, name) {
        setTimeout(() => {
            const statusEl = this.el.shadowRoot.getElementById('change-status');
            if (statusEl) {
                if (type === 'attribute') {
                    statusEl.textContent = I18N[this.lang].attributeUpdateStatus.replaceAll('{name}', name);
                }
                else if (type === 'framework') {
                    statusEl.textContent = I18N[this.lang].frameworkUpdateStatus.replaceAll('{name}', name);
                }
                else {
                    statusEl.textContent = I18N[this.lang].slotUpdateStatus.replaceAll('{name}', name);
                }
            }
            setTimeout(() => {
                if (statusEl) {
                    statusEl.textContent = '';
                }
            }, 5000);
        }, 1500);
    }
    /* ---------------------------
     * Render
     * --------------------------- */
    render() {
        const { lang } = this;
        return (h(Host, { key: 'e920cc6d04392d57453ee1aaf06f4362d6461b31' }, h("code-frame", { key: '2a9bbd1131e3257f4e2d200701925f18575c05ea', source: this.codeSource, landmarkDisplay: this.landmarkDisplay, accessibility: this.accessibility, framework: this.framework, lang: this.lang }, h("slot", { key: '283320a0a37b0d06142c22e42827c587228b429a' })), this.attributeObject || this.slotObject || this.eventObject || this.accessibility ? (h("div", { id: "tabs" }, h("gcds-heading", { tag: "h4" }, I18N[lang].tabsHeading), h("div", { role: "tablist" }, this.attributeObject && (h("gcds-button", { id: "attrs", "button-role": "secondary", role: "presentation", onClick: () => this.setDisplay('attrs'), class: this.display == 'attrs' && 'selected' }, I18N[lang].tabsAttributes)), this.slotObject && (h("gcds-button", { id: "slots", "button-role": "secondary", role: "presentation", class: this.display == 'slots' && 'selected', onClick: () => this.setDisplay('slots') }, I18N[lang].tabsSlots)), this.eventObject && (h("gcds-button", { id: "events", "button-role": "secondary", role: "presentation", class: this.display == 'events' && 'selected', onClick: () => this.setDisplay('events') }, I18N[lang].tabsEvents)), this.accessibility && (h("gcds-button", { id: "a11y", "button-role": "secondary", role: "presentation", class: this.display == 'a11y' && 'selected', onClick: () => this.setDisplay('a11y') }, I18N[lang].tabsA11y))), this.attributeObject && (h("attribute-tab", { displayElement: this.displayElement, attributeObject: this.attributeObject, class: this.display != 'attrs' && 'hidden' })), this.slotObject && (h("slots-tab", { displayElement: this.displayElement, slotObject: this.slotObject, slotHistory: this.slotHistory, class: this.display != 'slots' && 'hidden' })), this.eventObject && h("events-tab", { eventObject: this.eventObject, class: this.display != 'events' && 'hidden' }), this.accessibility && (h("accessibility-tab", { displayElement: this.displayElement, class: `tabs--accessibility${this.display != 'a11y' ? ' hidden' : ''}`, landmarkDisplay: this.landmarkDisplay, lang: this.lang })))) : null, h("span", { key: '31ff9130870c944f71c47ab3da6bf8800da81cc9', id: "change-status", role: "status", "aria-atomic": "true", "aria-relevant": "removals" }), h("gcds-sr-only", { key: 'edbd0113e9571f49f25807bca504420df9338995', tag: "span" })));
    }
    static get watchers() { return {
        "attrs": ["validateAttrs"],
        "slots": ["validateSlots"],
        "events": ["validateEvents"]
    }; }
    static get style() { return componentDisplayCss; }
}, [1, "component-display", {
        "attrs": [1],
        "slots": [1],
        "events": [1],
        "accessibility": [4],
        "landmarkDisplay": [4, "landmark-display"],
        "framework": [1],
        "display": [32],
        "lang": [32],
        "codeSource": [32]
    }, [[4, "attributeChange", "attributeChangeListener"], [4, "statusUpdate", "statusUpdateListener"], [4, "slotValueChange", "slotValueChangeListener"], [4, "keydown", "keyDownListener"]], {
        "attrs": ["validateAttrs"],
        "slots": ["validateSlots"],
        "events": ["validateEvents"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["component-display", "accessibility-tab", "attribute-tab", "code-frame", "events-tab", "slots-tab"];
    components.forEach(tagName => { switch (tagName) {
        case "component-display":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ComponentDisplay$1);
            }
            break;
        case "accessibility-tab":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "attribute-tab":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "code-frame":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "events-tab":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "slots-tab":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}
defineCustomElement$1();

const ComponentDisplay = ComponentDisplay$1;
const defineCustomElement = defineCustomElement$1;

export { ComponentDisplay, defineCustomElement };
//# sourceMappingURL=component-display.js.map

//# sourceMappingURL=component-display.js.map