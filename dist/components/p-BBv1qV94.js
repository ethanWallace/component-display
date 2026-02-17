import { p as proxyCustomElement, H, c as createEvent, h, a as Host } from './index.js';
import { a as assignLanguage, c as closestElement, f as formatDataLabel } from './p-BbO8WzMW.js';

const I18N = {
  en: {
    attributes: 'Attribute',
    type: 'Type',
    defaultValue: 'Default value',
    control: 'Control',
    noType: 'No type specified',
    noDefaultValue: 'No default value',
    required: ' (required)',
  },
  fr: {
    attributes: 'Attribut',
    type: 'Type',
    defaultValue: 'Valeur par défaut',
    control: 'Contrôle',
    noType: 'Aucun type spécifié',
    noDefaultValue: 'Aucune valeur par défaut',
    required: ' (obligatoire)',
  },
};

const attributeTabCss = ":host {\n  display: block;\n\n  table > tr > td:first-child {\n    font: var(--gcds-label-font-mobile);\n\n    .required {\n      font-weight: var(--gcds-label-required-font-weight);\n    }\n  }\n}\n";

const AttributeTab = /*@__PURE__*/ proxyCustomElement(class AttributeTab extends H {
    constructor() {
        super();
        this.__registerHost();
        this.attributeChange = createEvent(this, "attributeChange");
        this.statusUpdate = createEvent(this, "statusUpdate");
    }
    get el() { return this; }
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
        return (h(Host, { key: 'ad41a5f59b62aed6dab12414114d4950563fd5bb', role: "tabpanel", tabindex: "0" }, h("table", { key: 'a863b8e6cc2b73613b549bb27f519d7e4eaa8120', class: "attributes" }, h("tr", { key: '0305dfc4c2d206bcb630090e7fac813903d47fb2' }, h("th", { key: '91bd2f4a1d402848d1b2e15e5c860579b987335a' }, I18N[lang].attributes), h("th", { key: '0b42c1ad7e9a10c19c2045fb817e46c2cb82448e' }, I18N[lang].type), h("th", { key: '6402421cb9ad340daa4afc43009dd8cc8f6979ad' }, I18N[lang].defaultValue), h("th", { key: 'dec1a008673cf2c052a0e79b21e780668ea4d183' }, I18N[lang].control)), this.attributeObject &&
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
                return (h("tr", null, h("td", { "data-label": formatDataLabel(I18N[lang].attributes, lang) }, h("span", { lang: "en" }, attr.name), attr.required && (h("span", { class: "required", "aria-hidden": "true" }, I18N[lang].required))), h("td", { "data-label": formatDataLabel(I18N[lang].type, lang) }, attr?.type ? h("span", { lang: "en" }, attr.type) : h("gcds-sr-only", { tag: "span" }, I18N[lang].noType)), h("td", { "data-label": formatDataLabel(I18N[lang].defaultValue, lang) }, attr?.defaultValue ? h("span", { lang: "en" }, attr.defaultValue) : h("gcds-sr-only", null, I18N[lang].noDefaultValue)), h("td", null, control)));
            }))));
    }
    static get style() { return attributeTabCss; }
}, [0, "attribute-tab", {
        "attributeObject": [16, "attribute-object"],
        "displayElement": [16, "display-element"],
        "lang": [32],
        "lastInputTimestamp": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["attribute-tab"];
    components.forEach(tagName => { switch (tagName) {
        case "attribute-tab":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, AttributeTab);
            }
            break;
    } });
}
defineCustomElement();

export { AttributeTab as A, defineCustomElement as d };
//# sourceMappingURL=p-BBv1qV94.js.map

//# sourceMappingURL=p-BBv1qV94.js.map