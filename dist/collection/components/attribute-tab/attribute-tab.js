import { Host, h } from "@stencil/core";
import { assignLanguage, closestElement, formatDataLabel } from "../../utils/utils";
import i18n from "./i18n/i18n";
export class AttributeTab {
    el;
    valueChecker = null;
    lastInputValue = {};
    /* ---------------------------
     * Props
     * --------------------------- */
    attributeObject;
    displayElement;
    /* ---------------------------
     * Events
     * --------------------------- */
    attributeChange;
    statusUpdate;
    /* ---------------------------
     * State
     * --------------------------- */
    lang = 'en';
    lastInputTimestamp = [];
    /* ---------------------------
     * Helpers
     * --------------------------- */
    formatEventDetail(e) {
        const eventDetail = {
            name: e.target.name,
            value: e.target.value,
        };
        // Store timestamp and value of element for comparison in interval
        this.lastInputTimestamp[e.target.name] = Date.now();
        this.lastInputValue[e.target.name] = e.target.value;
        this.attributeChange.emit(eventDetail);
    }
    onFocusStartInterval = (e) => {
        const element = e.target.shadowRoot.querySelector(`[name="${e.target.name}"]`);
        const value = element.value;
        const name = element.name;
        // Start value checking on input
        this.valueChecker = window.setInterval(() => {
            if (Date.now() - 500 >= this.lastInputTimestamp[name]) {
                if (value !== this.lastInputValue[name]) {
                    this.statusUpdate.emit({ name: name, type: 'attribute' });
                    clearInterval(this.valueChecker);
                }
            }
        }, 1000);
    };
    onBlurClearInterval = () => {
        if (this.valueChecker) {
            window.clearInterval(this.valueChecker);
        }
    };
    /* ---------------------------
     * Lifecycle
     * --------------------------- */
    async componentWillLoad() {
        // Define lang attribute
        this.lang = assignLanguage(this.el);
    }
    /* ---------------------------
     * Render
     * --------------------------- */
    render() {
        const { lang } = this;
        return (h(Host, { key: 'ad41a5f59b62aed6dab12414114d4950563fd5bb', role: "tabpanel", tabindex: "0" }, h("table", { key: 'a863b8e6cc2b73613b549bb27f519d7e4eaa8120', class: "attributes" }, h("tr", { key: '0305dfc4c2d206bcb630090e7fac813903d47fb2' }, h("th", { key: '91bd2f4a1d402848d1b2e15e5c860579b987335a' }, i18n[lang].attributes), h("th", { key: '0b42c1ad7e9a10c19c2045fb817e46c2cb82448e' }, i18n[lang].type), h("th", { key: '6402421cb9ad340daa4afc43009dd8cc8f6979ad' }, i18n[lang].defaultValue), h("th", { key: 'dec1a008673cf2c052a0e79b21e780668ea4d183' }, i18n[lang].control)), this.attributeObject &&
            this.attributeObject.map(attr => {
                let control = '';
                let displayValue = this.displayElement.getAttribute(attr.name) != null ? this.displayElement.getAttribute(attr.name) : attr?.defaultValue;
                // Special case for lang attribute to inherit from closest parent with lang attribute
                if (attr.name === 'lang') {
                    displayValue = closestElement('[lang]', this.displayElement).getAttribute('lang') || displayValue;
                }
                this.lastInputValue = { ...this.lastInputValue, [attr.name]: displayValue };
                if (attr.control === 'select') {
                    const options = typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options;
                    control = (h("gcds-select", { label: attr.name, selectId: attr.name, name: attr.name, value: displayValue, "hide-label": true, onInput: e => this.formatEventDetail(e), onFocus: e => this.onFocusStartInterval(e), onBlur: this.onBlurClearInterval }, typeof options === 'object' &&
                        options.map(option => (h("option", { key: option, value: option }, option)))));
                }
                else if (attr.control === 'text') {
                    control = (h("gcds-input", { name: attr.name, label: attr.name, inputId: attr.name, "hide-label": true, type: "text", value: displayValue, onInput: e => this.formatEventDetail(e), onFocus: e => this.onFocusStartInterval(e), onBlur: this.onBlurClearInterval }));
                }
                return (h("tr", null, h("td", { "data-label": formatDataLabel(i18n[lang].attributes, lang) }, h("span", { lang: "en" }, attr.name), attr.required && (h("span", { class: "required", "aria-hidden": "true" }, i18n[lang].required))), h("td", { "data-label": formatDataLabel(i18n[lang].type, lang) }, attr?.type ? h("span", { lang: "en" }, attr.type) : h("gcds-sr-only", { tag: "span" }, i18n[lang].noType)), h("td", { "data-label": formatDataLabel(i18n[lang].defaultValue, lang) }, attr?.defaultValue ? h("span", { lang: "en" }, attr.defaultValue) : h("gcds-sr-only", null, i18n[lang].noDefaultValue)), h("td", null, control)));
            }))));
    }
    static get is() { return "attribute-tab"; }
    static get originalStyleUrls() {
        return {
            "$": ["attribute-tab.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["attribute-tab.css"]
        };
    }
    static get properties() {
        return {
            "attributeObject": {
                "type": "unknown",
                "attribute": "attribute-object",
                "mutable": false,
                "complexType": {
                    "original": "Array<AttributesType>",
                    "resolved": "AttributesType[]",
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
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "displayElement": {
                "type": "unknown",
                "attribute": "display-element",
                "mutable": false,
                "complexType": {
                    "original": "Element",
                    "resolved": "Element",
                    "references": {
                        "Element": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Element"
                        }
                    }
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get states() {
        return {
            "lang": {},
            "lastInputTimestamp": {}
        };
    }
    static get events() {
        return [{
                "method": "attributeChange",
                "name": "attributeChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Object",
                    "resolved": "Object",
                    "references": {
                        "Object": {
                            "location": "global",
                            "id": "global::Object"
                        }
                    }
                }
            }, {
                "method": "statusUpdate",
                "name": "statusUpdate",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Object",
                    "resolved": "Object",
                    "references": {
                        "Object": {
                            "location": "global",
                            "id": "global::Object"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=attribute-tab.js.map
