import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import prettier from 'prettier/standalone';
import prettierPluginHTML from 'prettier/plugins/html';

import { formatSrcDoc, assignLanguage } from '../../utils/utils';

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

  /* ---------------------------
   * State
   * --------------------------- */

  @State() showCode = true;
  @State() activeFormat: 'html' | 'react' = 'html';
  @State() htmlCode = '';
  @State() reactCode = '';
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
      this.landmarkIframe.srcdoc = formatSrcDoc(
        this.source,
        this.accessibility,
        this.lang
      );
    }
  }

  /* ---------------------------
   * Lifecycle
   * --------------------------- */

  async componentWillLoad() {
    // Define lang attribute
    this.lang = assignLanguage(this.el);

  }

  componentDidLoad() {
    this.formatCodePreview();

    if (this.landmarkDisplay && this.landmarkIframe) {
      this.landmarkIframe.srcdoc = formatSrcDoc(
        this.source,
        this.accessibility,
        this.lang
      );
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
   * Formats the source code and applies syntax highlighting
   */
  private async formatCodePreview() {
    if (!this.source) return;

    const code = await prettier.format(this.source, {
      parser: 'html',
      plugins: [prettierPluginHTML],
    });

    const react = this.convertToReact(code);

    this.htmlCode = Prism.highlight(code, Prism.languages.html, 'html');
    this.reactCode = Prism.highlight(react, Prism.languages.jsx, 'jsx');

    this.updateDisplayedCode();
  }

  /*
   * Updates the displayed code based on the active format (HTML or React)
   */
  private updateDisplayedCode() {
    if (!this.codeEl) return;

    this.codeEl.innerHTML = this.activeFormat === 'html' ? this.htmlCode : this.reactCode;
  }

  /* ---------------------------
   * Actions
   * --------------------------- */

  /*
   * Handles the format selection change (HTML or React)
   */
  private onFormatChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.activeFormat = value === 'react' ? 'react' : 'html';

    this.updateDisplayedCode();
  }

  /*
   * Copies the current code to clipboard
   */
  private copyCode() {
    const code = this.activeFormat === 'html' ? this.codeEl?.textContent : this.codeEl?.textContent;

    if (!code) return;

    navigator.clipboard.writeText(code);

    this.copyLabel = 'Code copied';

    setTimeout(() => {
      this.copyLabel = 'Copy code';
    }, 3000);
  }

  /* ---------------------------
   * Render
   * --------------------------- */

  render() {
    return (
      <div class="code-frame">
        {/* Code actions bar: Format selection and toggle visibility */}
        <div class="code-actions-bar">
          <gcds-select select-id="code-format" label="Select environment" hide-label name="select" onChange={e => this.onFormatChange(e)}>
            <option value="html">HTML</option>
            <option value="react">React</option>
          </gcds-select>
          <gcds-button button-role="secondary" onClick={() => (this.showCode = !this.showCode)}>
            {this.showCode ? 'Hide code' : 'Show code'}
          </gcds-button>
        </div>

        {/* Component preview area */}
        <div class="component-preview">
          {this.landmarkDisplay ?
            <iframe
              title="Landmark elements display"
              ref={element => (this.landmarkIframe = element as HTMLIFrameElement)}
            ></iframe>
            :
            <slot></slot>
          }
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
