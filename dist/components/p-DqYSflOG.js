import { p as proxyCustomElement, H, h, a as Host } from './index.js';
import { a as assignLanguage, f as formatDataLabel } from './p-BbO8WzMW.js';

const I18N = {
  en: {
    caption: 'Review the custom events the component emits and understand when they are triggered and what data they provide.',
    name: 'Event name',
    description: 'Description',
    details: 'Details',
  },
  fr: {
    caption: 'Review the custom events the component emits and understand when they are triggered and what data they provide. (TODO FR)',
    name: "Nom de l'événement",
    description: 'Description',
    details: 'Details (TODO FR)',
  },
};

const eventsTabCss = ":host{display:block}";

const EventsTab = /*@__PURE__*/ proxyCustomElement(class EventsTab extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    get el() { return this; }
    /* ---------------------------
     * Props
     * --------------------------- */
    eventObject;
    /* ---------------------------
     * State
     * --------------------------- */
    lang = 'en';
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
        return (h(Host, { key: '4b015db9dd12f16f48699f73aec4eb63f65adcba', role: "tabpanel", tabindex: "0" }, h("table", { key: 'f54004f5e4860fbde92018d9b117d0c3205de365', class: "events" }, h("caption", { key: '1424cdd3b2e5e0c2995f99ebc5cf33bd8bc36a3d' }, I18N[lang].caption), h("tr", { key: '040b82322a10122266e569bf514d3ce2fbb34653' }, h("th", { key: '2750fe6d71f068ad578139860a0dd3f52bfc1126' }, I18N[lang].name), h("th", { key: 'b327fdaac45521fa09476d5e6c07a1d955a81c9d' }, I18N[lang].description), h("th", { key: '6418bc14bd78d8e019b8cf2d574e880366ae0cbc' }, I18N[lang].details)), this.eventObject.map(event => {
            return (h("tr", { class: event.name }, h("td", { "data-label": formatDataLabel(I18N[lang].name, lang) }, event.name), h("td", { "data-label": formatDataLabel(I18N[lang].description, lang) }, event.description), h("td", { "data-label": formatDataLabel(I18N[lang].details, lang) }, event.details)));
        }))));
    }
    static get style() { return eventsTabCss; }
}, [0, "events-tab", {
        "eventObject": [16, "event-object"],
        "lang": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["events-tab"];
    components.forEach(tagName => { switch (tagName) {
        case "events-tab":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, EventsTab);
            }
            break;
    } });
}
defineCustomElement();

export { EventsTab as E, defineCustomElement as d };
//# sourceMappingURL=p-DqYSflOG.js.map

//# sourceMappingURL=p-DqYSflOG.js.map