import { Host, h } from "@stencil/core";
import { assignLanguage, formatDataLabel } from "../../utils/utils";
import i18n from "./i18n/i18n";
export class EventsTab {
    el;
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
        return (h(Host, { key: '4b015db9dd12f16f48699f73aec4eb63f65adcba', role: "tabpanel", tabindex: "0" }, h("table", { key: 'f54004f5e4860fbde92018d9b117d0c3205de365', class: "events" }, h("caption", { key: '1424cdd3b2e5e0c2995f99ebc5cf33bd8bc36a3d' }, i18n[lang].caption), h("tr", { key: '040b82322a10122266e569bf514d3ce2fbb34653' }, h("th", { key: '2750fe6d71f068ad578139860a0dd3f52bfc1126' }, i18n[lang].name), h("th", { key: 'b327fdaac45521fa09476d5e6c07a1d955a81c9d' }, i18n[lang].description), h("th", { key: '6418bc14bd78d8e019b8cf2d574e880366ae0cbc' }, i18n[lang].details)), this.eventObject.map(event => {
            return (h("tr", { class: event.name }, h("td", { "data-label": formatDataLabel(i18n[lang].name, lang) }, event.name), h("td", { "data-label": formatDataLabel(i18n[lang].description, lang) }, event.description), h("td", { "data-label": formatDataLabel(i18n[lang].details, lang) }, event.details)));
        }))));
    }
    static get is() { return "events-tab"; }
    static get originalStyleUrls() {
        return {
            "$": ["events-tab.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["events-tab.css"]
        };
    }
    static get properties() {
        return {
            "eventObject": {
                "type": "unknown",
                "attribute": "event-object",
                "mutable": false,
                "complexType": {
                    "original": "Array<EventType>",
                    "resolved": "EventType[]",
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
            "lang": {}
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=events-tab.js.map
