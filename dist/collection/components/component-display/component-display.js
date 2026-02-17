import { Host, h } from "@stencil/core";
import { assignLanguage, removeUnwantedAttributes } from "../../utils/utils";
import i18n from "./i18n/i18n";
export class ComponentDisplay {
    el;
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
                    statusEl.textContent = i18n[this.lang].attributeUpdateStatus.replaceAll('{name}', name);
                }
                else if (type === 'framework') {
                    statusEl.textContent = i18n[this.lang].frameworkUpdateStatus.replaceAll('{name}', name);
                }
                else {
                    statusEl.textContent = i18n[this.lang].slotUpdateStatus.replaceAll('{name}', name);
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
        return (h(Host, { key: 'e920cc6d04392d57453ee1aaf06f4362d6461b31' }, h("code-frame", { key: '2a9bbd1131e3257f4e2d200701925f18575c05ea', source: this.codeSource, landmarkDisplay: this.landmarkDisplay, accessibility: this.accessibility, framework: this.framework, lang: this.lang }, h("slot", { key: '283320a0a37b0d06142c22e42827c587228b429a' })), this.attributeObject || this.slotObject || this.eventObject || this.accessibility ? (h("div", { id: "tabs" }, h("gcds-heading", { tag: "h4" }, i18n[lang].tabsHeading), h("div", { role: "tablist" }, this.attributeObject && (h("gcds-button", { id: "attrs", "button-role": "secondary", role: "presentation", onClick: () => this.setDisplay('attrs'), class: this.display == 'attrs' && 'selected' }, i18n[lang].tabsAttributes)), this.slotObject && (h("gcds-button", { id: "slots", "button-role": "secondary", role: "presentation", class: this.display == 'slots' && 'selected', onClick: () => this.setDisplay('slots') }, i18n[lang].tabsSlots)), this.eventObject && (h("gcds-button", { id: "events", "button-role": "secondary", role: "presentation", class: this.display == 'events' && 'selected', onClick: () => this.setDisplay('events') }, i18n[lang].tabsEvents)), this.accessibility && (h("gcds-button", { id: "a11y", "button-role": "secondary", role: "presentation", class: this.display == 'a11y' && 'selected', onClick: () => this.setDisplay('a11y') }, i18n[lang].tabsA11y))), this.attributeObject && (h("attribute-tab", { displayElement: this.displayElement, attributeObject: this.attributeObject, class: this.display != 'attrs' && 'hidden' })), this.slotObject && (h("slots-tab", { displayElement: this.displayElement, slotObject: this.slotObject, slotHistory: this.slotHistory, class: this.display != 'slots' && 'hidden' })), this.eventObject && h("events-tab", { eventObject: this.eventObject, class: this.display != 'events' && 'hidden' }), this.accessibility && (h("accessibility-tab", { displayElement: this.displayElement, class: `tabs--accessibility${this.display != 'a11y' ? ' hidden' : ''}`, landmarkDisplay: this.landmarkDisplay, lang: this.lang })))) : null, h("gcds-sr-only", { key: 'e9f0c083ffde18e3c1a7c6399f503d1beb9e7d17', tag: "span" }, h("span", { key: 'a70e2ca590b841904fffc0c855e9ec2687412c35', id: "change-status", role: "status", "aria-atomic": "true", "aria-relevant": "removals" }))));
    }
    static get is() { return "component-display"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["component-display.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["component-display.css"]
        };
    }
    static get properties() {
        return {
            "attrs": {
                "type": "string",
                "attribute": "attrs",
                "mutable": false,
                "complexType": {
                    "original": "string | Array<AttributesType>",
                    "resolved": "AttributesType[] | string",
                    "references": {
                        "Array": {
                            "location": "global",
                            "id": "global::Array"
                        },
                        "AttributesType": {
                            "location": "import",
                            "path": "../../utils/utils",
                            "id": "src/utils/utils.ts::AttributesType"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false
            },
            "slots": {
                "type": "string",
                "attribute": "slots",
                "mutable": false,
                "complexType": {
                    "original": "string | Array<SlotType>",
                    "resolved": "SlotType[] | string",
                    "references": {
                        "Array": {
                            "location": "global",
                            "id": "global::Array"
                        },
                        "SlotType": {
                            "location": "import",
                            "path": "../../utils/utils",
                            "id": "src/utils/utils.ts::SlotType"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false
            },
            "events": {
                "type": "string",
                "attribute": "events",
                "mutable": false,
                "complexType": {
                    "original": "string | Array<EventType>",
                    "resolved": "EventType[] | string",
                    "references": {
                        "Array": {
                            "location": "global",
                            "id": "global::Array"
                        },
                        "EventType": {
                            "location": "import",
                            "path": "../../utils/utils",
                            "id": "src/utils/utils.ts::EventType"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false
            },
            "accessibility": {
                "type": "boolean",
                "attribute": "accessibility",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "false"
            },
            "landmarkDisplay": {
                "type": "boolean",
                "attribute": "landmark-display",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "false"
            },
            "framework": {
                "type": "string",
                "attribute": "framework",
                "mutable": false,
                "complexType": {
                    "original": "'html' | 'react' | 'vue' | 'angular'",
                    "resolved": "\"angular\" | \"html\" | \"react\" | \"vue\"",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "'html'"
            }
        };
    }
    static get states() {
        return {
            "display": {},
            "lang": {},
            "codeSource": {}
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "attrs",
                "methodName": "validateAttrs"
            }, {
                "propName": "slots",
                "methodName": "validateSlots"
            }, {
                "propName": "events",
                "methodName": "validateEvents"
            }];
    }
    static get listeners() {
        return [{
                "name": "attributeChange",
                "method": "attributeChangeListener",
                "target": "document",
                "capture": false,
                "passive": false
            }, {
                "name": "statusUpdate",
                "method": "statusUpdateListener",
                "target": "document",
                "capture": false,
                "passive": false
            }, {
                "name": "slotValueChange",
                "method": "slotValueChangeListener",
                "target": "document",
                "capture": false,
                "passive": false
            }, {
                "name": "keydown",
                "method": "keyDownListener",
                "target": "document",
                "capture": false,
                "passive": false
            }];
    }
}
//# sourceMappingURL=component-display.js.map
