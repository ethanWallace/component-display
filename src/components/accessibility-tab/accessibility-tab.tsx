import { Component, Host, h, State, Element, Prop } from '@stencil/core';
import axe from 'axe-core';
import axeLocaleFr from 'axe-core/locales/fr.json';

import { assignLanguage } from '../../utils/utils';

@Component({
  tag: 'accessibility-tab',
  styleUrl: 'accessibility-tab.css',
  shadow: false,
})
export class AccessibilityTab {
  @Element() el: HTMLElement;

  @Prop() displayElement!: Element;

  @State() axeResults: axe.AxeResults | null = null;
  @State() testRunning: boolean = false;
  @State() lang: string = 'en';

  private async runA11yTest() {
    if (this.testRunning) {
      console.warn('Accessibility test is already running.');
      return;
    }

    this.testRunning = true;

    try {
      const container = this.el.querySelector('#test-container');

      container.innerHTML = this.displayElement.outerHTML;

      setTimeout(async () => {
        if (this.lang === 'fr') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          axe.configure({ locale: axeLocaleFr });
        }

        this.axeResults = await axe.run(container);
        console.log(this.axeResults);
        console.log('Accessibility Violations:', this.axeResults.violations);

        container.innerHTML = '';
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

  async ComponentWillLoad() {
    this.lang = assignLanguage(this.el);
  }

  render() {
    return (
      <Host
        role="tabpanel"
        tabindex="0"
      >
        <gcds-button
          button-role="secondary"
          disabled={this.testRunning}
          onClick={async () => {
            await this.runA11yTest();
          }}
        >
          {this.testRunning ?
            <span>Running accessibility test</span>
            :
            <span>Run accessibility test</span>
          }
        </gcds-button>

        <p aria-live="polite">
          {this.axeResults && this.axeResults.violations.length > 0
            ? `${this.axeResults.violations.length} issue(s) found. Please reference table below for more details.`
            : this.axeResults && `No issues found. Please reference table below to see passed tests.`}
        </p>

        <div id="test-container"></div>

        {this.renderAxeResultsTable()}
      </Host>
    );
  }
}
