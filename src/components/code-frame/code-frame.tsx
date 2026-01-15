import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import prettier from 'prettier/standalone';
import prettierPluginHTML from 'prettier/plugins/html';
import { formatSrcDoc, assignLanguage } from '../../utils/utils';
import i18n from './i18n/i18n';

@Component({
  tag: 'code-frame',
  styleUrls: ['prism.css', 'code-frame.css'],
  shadow: true,
})
export class CodeFrame {
  @Element() el: HTMLElement;
  private landmarkIframe?: HTMLIFrameElement;

  /* ---------------------------
   * Props
   * --------------------------- */

  /*
   * Source HTML code to be formatted and highlighted
   */
  @Prop() source: string;

  /*
   * Display landmark elements in iframe
   */
  @Prop() landmarkDisplay?: boolean = false;

  /*
   * Enable accessibility tests using axe-core in iframe
   */
  @Prop() accessibility?: boolean = false;

  /*
   * Starting framework for code preview generation
   */
  @Prop() framework?: 'html' | 'react' | 'vue' | 'angular' = 'html';

  /* ---------------------------
   * State
   * --------------------------- */

  @State() showCode = true;
  @State() activeFormat = '';
  @State() htmlCode = '';
  @State() reactCode = '';
  @State() vueCode = '';
  @State() angularCode = '';
  @State() copyLabel = 'Copy code';
  @State() lang = 'en';

  private codeEl?: HTMLElement;

  /* ---------------------------
   * Watchers
   * --------------------------- */

  @Watch('source')
  async onSourceChange() {
    await this.formatCodePreview();

    if (this.landmarkDisplay && this.landmarkIframe) {
      this.landmarkIframe.srcdoc = formatSrcDoc(this.source, this.accessibility, this.lang);
    }
  }

  /* ---------------------------
   * Lifecycle
   * --------------------------- */

  async componentWillLoad() {
    // Define lang attribute
    this.lang = assignLanguage(this.el);

    this.activeFormat = this.framework;
  }

  componentDidLoad() {
    this.formatCodePreview();

    if (this.landmarkDisplay && this.landmarkIframe) {
      this.landmarkIframe.srcdoc = formatSrcDoc(this.source, this.accessibility, this.lang);
    }
  }

  /* ---------------------------
   * Helpers
   * --------------------------- */

  /*
   * Converts HTML code to React JSX code
   */
  private convertToReact(html: string) {
    const react = html.replace(/"([^"]*)"|(\b[a-z]+(?:-[a-z]+)+\b)/g, (match, quoted, kebab) => {
      if (quoted) return `"${quoted}"`;

      if (kebab) {
        return kebab.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      }

      return match;
    });

    const code = react.replace(/<g/g, '<G').replace(/<\/g/g, '</G');
    const componentName = code.match(/<\w+/);

    if (!componentName) return code;

    const importStatement = `import { ${componentName[0].replace('<', '')} } from '@cdssnc/gcds-components-react';\n\n`;

    return importStatement + code;
  }

  /*
  * Converts HTML code to Angular code
  */
  private convertToAngular(html: string) {
    return html.replace(
      /(\s|^)([a-zA-Z_:][-a-zA-Z0-9_:]*)="(true|false)"/gi,
      '$1[$2]="$3"'
    );
  }

  /*
   * Formats the source code and applies syntax highlighting
   */
  private async formatCodePreview() {
    if (!this.source) return;

    const code = await prettier.format(this.source, {
      parser: 'html',
      plugins: [prettierPluginHTML],
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
  private updateDisplayedCode() {
    if (!this.codeEl) return;

    this.codeEl.innerHTML = this.getActiveCode();
  }

  /*
  * Retrieves the code corresponding to the active format
  */
  private getActiveCode() {
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
  private onFormatChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.activeFormat = value as 'html' | 'react' | 'vue' | 'angular';

    this.updateDisplayedCode();
  }

  /*
   * Copies the current code to clipboard
   */
  private copyCode() {
    const code = this.codeEl?.textContent;

    if (!code) return;

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

    return (
      <div class="code-frame">
        {/* Code actions bar: Format selection and toggle visibility */}
        <div class="code-actions-bar">
          <gcds-select select-id="code-format" label="Select environment" hide-label name="select" value={this.activeFormat} onChange={e => this.onFormatChange(e)}>
            <option value="html">HTML</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
          </gcds-select>
          <gcds-button button-role="secondary" onClick={() => (this.showCode = !this.showCode)}>
            {this.showCode ? i18n[lang].hideLabel : i18n[lang].showLabel}
          </gcds-button>
        </div>

        {/* Component preview area */}
        <div class="component-preview">
          {this.landmarkDisplay ? <iframe title="Landmark elements display" ref={element => (this.landmarkIframe = element as HTMLIFrameElement)} /> : <slot></slot>}
        </div>

        {/* Code preview area: Displays the formatted code */}
        <div class={`code-preview${!this.showCode ? ' hidden' : ''}`}>
          <pre class="language-html">
            <code ref={el => (this.codeEl = el as HTMLElement)}></code>

            {this.showCode && (
              <gcds-button button-role="secondary" size="small" onClick={() => this.copyCode()}>
                {this.copyLabel}
              </gcds-button>
            )}
          </pre>
        </div>
      </div>
    );
  }
}
