import { Component, Host, h, State, Element, Prop } from '@stencil/core';
import axe from 'axe-core';
import axeLocaleFr from 'axe-core/locales/fr.json';

import { assignLanguage, closestElement } from '../../utils/utils';
import i18n from './i18n/i18n';

@Component({
  tag: 'accessibility-tab',
  styleUrl: 'accessibility-tab.css',
  shadow: false,
})
export class AccessibilityTab {
  @Element() el: HTMLElement;

  /* ---------------------------
   * Props
   * --------------------------- */
  @Prop() displayElement!: Element;
  @Prop() landmarkDisplay?: boolean;

  /* ---------------------------
   * State
   * --------------------------- */

  @State() axeResults: axe.AxeResults | null = null;
  @State() testRunning: boolean = false;
  @State() lang: string = 'en';

  /* ---------------------------
   * Actions
   * --------------------------- */

  private async runA11yTest() {
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
              .contentWindow!.axe.configure({ locale: axeLocaleFr });
          } else {
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
            .contentWindow!.axe.run(container);
        } else {
          this.axeResults = await axe.run(container);
        }

        if (!this.landmarkDisplay) {
          container.innerHTML = '';
        }
      }, 2000);
    } catch (error) {
      console.error('Error running accessibility tests:', error);
      return null;
    } finally {
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
      return (
        <table>
          <thead>
            <tr>
              <th>Violation ID</th>
              <th>Description</th>
              <th>Affected Element(s)</th>
              <th>Failure Summary</th>
            </tr>
          </thead>
          <tbody>
            {this.axeResults.violations.map(violation => (
              <tr key={violation.id}>
                <td>{violation.id}</td>
                <td>{violation.description}</td>
                <td>
                  <ul>
                    {violation.nodes.map((node, index) => (
                      <li key={index}>
                        <code>{node.html}</code>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {violation.nodes.map((node, index) => (
                      <li key={index}>{node.failureSummary}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (this.axeResults) {
      return (
        <table>
          <thead>
            <tr>
              <th>Test</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {this.axeResults.passes.map(pass => (
              <tr key={pass.id}>
                <td>{pass.id}</td>
                <td>{pass.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
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

    return (
      <Host role="tabpanel" tabindex="0">
        <gcds-button
          button-role="secondary"
          disabled={this.testRunning}
          onClick={async () => {
            await this.runA11yTest();
          }}
        >
          {this.testRunning ? <span>{i18n[lang].runningTest}</span> : <span>{i18n[lang].runTest}</span>}
        </gcds-button>

        <p aria-live="polite">
          {this.axeResults && this.axeResults.violations.length > 0 ? `${this.axeResults.violations.length} ${i18n[lang].issues}` : this.axeResults && i18n[lang].noIssues}
        </p>

        <div id="test-container"></div>

        {this.renderAxeResultsTable()}
      </Host>
    );
  }
}
