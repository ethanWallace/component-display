import { Host, h } from "@stencil/core";
import axe from "axe-core";
import axeLocaleFr from "axe-core/locales/fr.json";
import { assignLanguage, closestElement } from "../../utils/utils";
import i18n from "./i18n/i18n";
export class AccessibilityTab {
    el;
    /* ---------------------------
     * Props
     * --------------------------- */
    displayElement;
    landmarkDisplay;
    /* ---------------------------
     * State
     * --------------------------- */
    axeResults = null;
    testRunning = false;
    lang = 'en';
    /* ---------------------------
     * Actions
     * --------------------------- */
    async runA11yTest() {
        if (this.testRunning) {
            console.warn('Accessibility test is already running.');
            return;
        }
        this.testRunning = true;
        try {
            const container = this.landmarkDisplay
                ? closestElement('component-display', this.el).shadowRoot.querySelector('code-frame').shadowRoot.querySelector('iframe').contentWindow.document.body
                : this.el.querySelector('#test-container');
            if (!this.landmarkDisplay) {
                container.innerHTML = this.displayElement.outerHTML;
            }
            setTimeout(async () => {
                if (this.lang === 'fr') {
                    if (this.landmarkDisplay) {
                        closestElement('component-display', this.el)
                            .shadowRoot.querySelector('code-frame')
                            .shadowRoot.querySelector('iframe')
                            .contentWindow.axe.configure({ locale: axeLocaleFr });
                    }
                    else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        axe.configure({ locale: axeLocaleFr });
                    }
                }
                // Test on component inside iframe
                if (this.landmarkDisplay) {
                    this.axeResults = await closestElement('component-display', this.el)
                        .shadowRoot.querySelector('code-frame')
                        .shadowRoot.querySelector('iframe')
                        .contentWindow.axe.run(container);
                }
                else {
                    this.axeResults = await axe.run(container);
                }
                if (!this.landmarkDisplay) {
                    container.innerHTML = '';
                }
            }, 2000);
        }
        catch (error) {
            console.error('Error running accessibility tests:', error);
            return null;
        }
        finally {
            setTimeout(() => {
                this.testRunning = false;
            }, 2000);
        }
    }
    /* ---------------------------
     * Helpers
     * --------------------------- */
    renderAxeResultsTable() {
        if (this.axeResults && this.axeResults.violations.length > 0) {
            return (h("table", { class: "axe-results-table" }, h("thead", null, h("tr", null, h("th", null, i18n[this.lang].violationID), h("th", null, i18n[this.lang].description), h("th", null, i18n[this.lang].affected), h("th", null, i18n[this.lang].summary))), h("tbody", null, this.axeResults.violations.map(violation => (h("tr", { key: violation.id }, h("td", null, violation.id), h("td", null, violation.description), h("td", null, h("ul", null, violation.nodes.map((node, index) => (h("li", { key: index }, h("code", null, node.html)))))), h("td", null, h("ul", null, violation.nodes.map((node, index) => (h("li", { key: index }, node.failureSummary)))))))))));
        }
        else if (this.axeResults) {
            return (h("table", { class: "axe-results-table" }, h("thead", null, h("tr", null, h("th", null, i18n[this.lang].test), h("th", null, i18n[this.lang].description))), h("tbody", null, this.axeResults.passes.map(pass => (h("tr", { key: pass.id }, h("td", null, pass.id), h("td", null, pass.description)))))));
        }
        return null;
    }
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
        return (h(Host, { key: '17baddd2326f4fff207fad53e15dda6350c104d5', role: "tabpanel", tabindex: "0" }, h("gcds-button", { key: '62307ab6007e7d1a0a1594762f7ead14b5a5b011', "button-role": "secondary", disabled: this.testRunning, onClick: async () => {
                await this.runA11yTest();
            } }, this.testRunning ? h("span", null, i18n[lang].runningTest) : h("span", null, i18n[lang].runTest)), h("p", { key: 'dcdeaa184c5ca91233f1dd096b67597a9b217753', "aria-live": "polite" }, this.axeResults && this.axeResults.violations.length > 0 ? `${this.axeResults.violations.length} ${i18n[lang].issues}` : this.axeResults && i18n[lang].noIssues), h("div", { key: '8b237ec02e1bfd050947fe74b93d36acc829846e', id: "test-container" }), this.renderAxeResultsTable()));
    }
    static get is() { return "accessibility-tab"; }
    static get originalStyleUrls() {
        return {
            "$": ["accessibility-tab.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["accessibility-tab.css"]
        };
    }
    static get properties() {
        return {
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
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "axeResults": {},
            "testRunning": {},
            "lang": {}
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=accessibility-tab.js.map
