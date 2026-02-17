import { h } from "@stencil/core";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import prettier from "prettier/standalone";
import prettierPluginHTML from "prettier/plugins/html";
import { formatSrcDoc, assignLanguage, iframeListeners } from "../../utils/utils";
import i18n from "./i18n/i18n";
export class CodeFrame {
    el;
    landmarkIframe;
    /* ---------------------------
     * Props
     * --------------------------- */
    /*
     * Source HTML code to be formatted and highlighted
     */
    source;
    /*
     * Display landmark elements in iframe
     */
    landmarkDisplay = false;
    /*
     * Enable accessibility tests using axe-core in iframe
     */
    accessibility = false;
    /*
     * Starting framework for code preview generation
     */
    framework = 'html';
    /* ---------------------------
     * Events
     * --------------------------- */
    statusUpdate;
    /* ---------------------------
     * State
     * --------------------------- */
    showCode = true;
    activeFormat = '';
    htmlCode = '';
    reactCode = '';
    vueCode = '';
    angularCode = '';
    copyLabel = 'Copy code';
    lang = 'en';
    codeEl;
    /* ---------------------------
     * Watchers
     * --------------------------- */
    async onSourceChange() {
        await this.formatCodePreview();
        if (this.landmarkDisplay && this.landmarkIframe) {
            this.landmarkIframe.srcdoc = formatSrcDoc(this.source, this.accessibility, this.lang);
        }
    }
    async onFrameworkChange() {
        this.activeFormat = this.framework;
        await this.updateDisplayedCode();
    }
    /* ---------------------------
     * Lifecycle
     * --------------------------- */
    async componentWillLoad() {
        // Define lang attribute
        this.lang = assignLanguage(this.el);
        this.copyLabel = i18n[this.lang].copyLabel;
        this.activeFormat = this.framework;
    }
    componentDidLoad() {
        this.formatCodePreview();
        if (this.landmarkDisplay && this.landmarkIframe) {
            this.landmarkIframe.srcdoc = formatSrcDoc(this.source, this.accessibility, this.lang);
            this.landmarkIframe.onload = () => {
                const intervalId = setInterval(() => {
                    const hydratedComponent = this.landmarkIframe.contentDocument.body.querySelector('.hydrated');
                    if (hydratedComponent) {
                        clearInterval(intervalId);
                        iframeListeners(this.landmarkIframe);
                    }
                }, 100);
            };
        }
    }
    /* ---------------------------
     * Helpers
     * --------------------------- */
    /*
     * Converts HTML code to React JSX code
     */
    convertToReact(html) {
        const react = html.replace(/"([^"]*)"|(\b[a-z]+(?:-[a-z]+)+\b)/g, (match, quoted, kebab) => {
            if (quoted)
                return `"${quoted}"`;
            if (kebab) {
                return kebab.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            }
            return match;
        });
        const code = react.replace(/<g/g, '<G').replace(/<\/g/g, '</G');
        const componentName = code.match(/<\w+/);
        if (!componentName)
            return code;
        const importStatement = `import { ${componentName[0].replace('<', '')} } from '@gcds-core/components-react';\n\n`;
        return importStatement + code;
    }
    /*
    * Converts HTML code to Angular code
    */
    convertToAngular(html) {
        return html.replace(/(\s|^)([a-zA-Z_:][-a-zA-Z0-9_:]*)="(true|false)"/gi, '$1[$2]="$3"');
    }
    /*
     * Formats the source code and applies syntax highlighting
     */
    async formatCodePreview() {
        if (!this.source)
            return;
        const code = await prettier.format(this.source, {
            parser: 'html',
            plugins: [prettierPluginHTML],
            printWidth: 120,
            htmlWhitespaceSensitivity: 'ignore',
            singleQuote: true
        });
        const react = this.convertToReact(code);
        const angular = this.convertToAngular(code);
        this.htmlCode = Prism.highlight(code, Prism.languages.html, 'html');
        this.vueCode = Prism.highlight(code, Prism.languages.html, 'html');
        this.reactCode = Prism.highlight(react, Prism.languages.jsx, 'jsx');
        this.angularCode = Prism.highlight(angular, Prism.languages.html, 'html');
        this.updateDisplayedCode();
    }
    /*
     * Updates the displayed code based on the active format
     */
    updateDisplayedCode() {
        if (!this.codeEl)
            return;
        this.codeEl.innerHTML = this.getActiveCode();
    }
    /*
    * Retrieves the code corresponding to the active format
    */
    getActiveCode() {
        switch (this.activeFormat) {
            case 'react':
                return this.reactCode;
            case 'vue':
                return this.vueCode;
            case 'angular':
                return this.angularCode;
            case 'html':
            default:
                return this.htmlCode;
        }
    }
    /* ---------------------------
     * Actions
     * --------------------------- */
    /*
     * Handles the format selection change (HTML or React)
     */
    onFormatChange(e) {
        const value = e.target.value;
        this.activeFormat = value;
        this.updateDisplayedCode();
        setTimeout(() => {
            this.statusUpdate.emit({ name: value, type: 'framework' });
        }, 2500);
    }
    /*
     * Copies the current code to clipboard
     */
    copyCode() {
        const code = this.codeEl?.textContent;
        if (!code)
            return;
        navigator.clipboard.writeText(code);
        this.copyLabel = i18n[this.lang].copiedLabel;
        setTimeout(() => {
            this.copyLabel = i18n[this.lang].copyLabel;
        }, 3000);
    }
    /* ---------------------------
     * Render
     * --------------------------- */
    render() {
        const { lang } = this;
        return (h("section", { key: '75eb4d76a6bc2e837c85caf9dcd026c92dd1e389', class: "code-frame", "aria-label": i18n[lang].componentPreview }, h("div", { key: '9320e86f3c4e7f6baab52a4dcf4b6096e6aea267', class: "code-actions-bar" }, h("gcds-select", { key: 'b330399861ae15c8a8f7df3b2398836226b8fb13', "select-id": "code-format", label: i18n[lang].selectEnvironment, "hide-label": true, name: "select", value: this.activeFormat, onChange: e => this.onFormatChange(e) }, h("option", { key: '635625a78beafec16a30d57bce8477de57e09f98', value: "html" }, "HTML"), h("option", { key: 'c304e53062459a7093003ed10f7f07d2ebfbc5f9', value: "react" }, "React"), h("option", { key: '0fb707a967b5434b26cf212e62760c6a2a4a7c6e', value: "vue" }, "Vue"), h("option", { key: 'e6502a267c588141a57663dd0eaf3deb63d34af0', value: "angular" }, "Angular")), h("gcds-button", { key: 'b8e6405706f573de5d9204375c5bc99955cfbc58', "button-role": "secondary", onClick: () => (this.showCode = !this.showCode) }, this.showCode ? i18n[lang].hideLabel : i18n[lang].showLabel)), h("div", { key: 'd1d388b4c97d67c4353b3471774bd07bd678181f', class: "component-preview" }, this.landmarkDisplay ?
            h("iframe", { title: i18n[lang].componentExample, ref: element => (this.landmarkIframe = element), style: { '--component-display-iframe-height': '12rem' } })
            :
                h("slot", null)), h("div", { key: '83bcf8daed1cc9d21a1ac9ce6d6c3d50829e10f9', class: `code-preview${!this.showCode ? ' hidden' : ''}` }, h("pre", { key: '5332615035bab3eee14bdf013ebb049c59a39438', class: "language-html" }, h("code", { key: '988d96532fff250f30f5ef89beeeedc2cd4ddb83', ref: el => (this.codeEl = el) }), this.showCode && (h("gcds-button", { key: '4c0469bc333c4026d3a2dc1e31c2dc13df6cecf8', "button-role": "secondary", size: "small", onClick: () => this.copyCode() }, this.copyLabel))))));
    }
    static get is() { return "code-frame"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["prism.css", "code-frame.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["prism.css", "code-frame.css"]
        };
    }
    static get properties() {
        return {
            "source": {
                "type": "string",
                "attribute": "source",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false
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
            "showCode": {},
            "activeFormat": {},
            "htmlCode": {},
            "reactCode": {},
            "vueCode": {},
            "angularCode": {},
            "copyLabel": {},
            "lang": {}
        };
    }
    static get events() {
        return [{
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
    static get watchers() {
        return [{
                "propName": "source",
                "methodName": "onSourceChange"
            }, {
                "propName": "framework",
                "methodName": "onFrameworkChange"
            }];
    }
}
//# sourceMappingURL=code-frame.js.map
