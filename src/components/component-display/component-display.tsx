import { Component, Host, h, Prop, Watch, Element, State } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import prettier from 'prettier/standalone';
import prettierPluginHTML from 'prettier/plugins/html';
import axe from 'axe-core';
import axeLocaleFr from 'axe-core/locales/fr.json';

import { assignLanguage } from '../../utils/utils';

export type AttributesType = {
  name: string;
  control: 'select' | 'text' | 'none';
  options?: Array<string>;
  required?: boolean;
  defaultValue?: string;
  type?: string;
  onlyProperty?: boolean;
};

export type SlotType = {
  name: string;
  description: string;
};

export type EventType = {
  name: string;
  description: string;
  details: string | object;
};

@Component({
  tag: 'component-display',
  styleUrls: ['prism.css', 'component-display.css'],
  shadow: true,
})
export class ComponentDisplay {
  @Element() el: HTMLElement;

  private displayElement?: Element;
  private htmlCodePreview?: HTMLElement;
  private reactCodePreview?: HTMLElement;
  private copyHTMLButton?: HTMLElement;
  private copyReactButton?: HTMLElement;

  private slotHistory: object = {};

  private attributeObject;
  private slotObject;
  private eventObject;

  /*
   * Array to format attributes table
   */
  @Prop() attrs?: string | Array<AttributesType>;
  @Watch('attrs')
  validateAttrs() {
    if (typeof this.attrs == 'object') {
      this.attributeObject = this.attrs;
    } else if (typeof this.attrs == 'string') {
      this.attributeObject = JSON.parse(this.attrs);
    }
  }

  /*
   * Array to format slots table
   */
  @Prop() slots?: string | Array<SlotType>;
  @Watch('slots')
  validateSlots() {
    if (typeof this.slots == 'object') {
      this.slotObject = this.slots;
    } else if (typeof this.slots == 'string') {
      this.slotObject = JSON.parse(this.slots);
    }
  }

  /*
   * Array to events attributes table
   */
  @Prop() events?: string | Array<EventType>;
  @Watch('events')
  validateEvents() {
    if (typeof this.events == 'object') {
      this.eventObject = this.events;
    } else if (typeof this.events == 'string') {
      this.eventObject = JSON.parse(this.events);
    }
  }

  /*
   * Enable accessibility tests using axe-core
   */
  @Prop() accessibility?: boolean = false;

  @State() display: string = 'attrs';
  @State() showCode: boolean = true;
  @State() axeResults: axe.AxeResults | null = null;
  @State() lang: string = 'en';

  private setDisplay(str) {
    this.display = str;
  }

  /////// Attribute changes

  private handleAttrInput = e => {
    // this.displayElement[e.target.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = e.target.value;
    this.displayElement.setAttribute(e.target.name, e.target.value);
    this.formatCodePreview();
  };

  /////// Slot changes

  private handleSlotInput = e => {
    if (e.target.name === 'default') {
      this.displayElement.innerHTML = this.displayElement.innerHTML.replace(this.displayElement.innerHTML, e.target.value);
    }

    this.displayElement.innerHTML = this.removeUnwantedAttributes(this.displayElement.innerHTML).replace(this.slotHistory[e.target.name], e.target.value);

    this.slotHistory[e.target.name] = e.target.value;

    this.formatCodePreview();
  };

  private getSlotValue(name) {
    if (name === 'default') {
      return this.displayElement.innerHTML;
    }

    if (this.displayElement.querySelector(`[slot="${name}"]`)) {
      this.slotHistory[name] = this.removeUnwantedAttributes(this.displayElement.querySelector(`[slot="${name}"]`)?.outerHTML);
      return this.slotHistory[name];
    }

    return '';
  }

  //////// Code preview

  private convertToReact(str) {
    const react = str.replace(/"([^"]*)"|(\b[a-z]+(?:-[a-z]+)+\b)/g, (match, quoted, kebab) => {
      if (quoted) return `"${quoted}"`;

      if (kebab) {
        return kebab.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      }

      return match;
    });

    const code = react.replace(/<g/g, '<G').replace(/<\/g/g, '</G');
    const componentName = code.match(/<\w+/);

    const importStatement = `import { ${componentName[0].replace('<', '')} } from @cdssnc/gcds-components-react; \n\n`;

    return importStatement + code;
  }

  private removeUnwantedAttributes(html) {
    const regex = /\s*(aria-[a-z-]+|class|(?<!-)\brole\b)="[^"]*"/g;
    return html.replace(regex, '');
  }

  private async formatCodePreview() {
    const code = await prettier.format(this.removeUnwantedAttributes(this.el.innerHTML), { parser: 'html', plugins: [prettierPluginHTML] });
    const react = this.convertToReact(code);

    this.htmlCodePreview.innerHTML = Prism.highlight(code, Prism.languages.html, 'html');
    this.reactCodePreview.innerHTML = Prism.highlight(react, Prism.languages.jsx, 'html');
  }

  private copyCode(e) {
    let code = '';
    if (e.target.name === 'html') {
      code = this.htmlCodePreview.textContent;
      this.copyHTMLButton.textContent = 'Code copied';
      setTimeout(() => {
        this.copyHTMLButton.textContent = 'Copy HTML';
      }, 3000);
    } else {
      code = this.reactCodePreview.textContent;
      this.copyReactButton.textContent = 'Code copied';
      setTimeout(() => {
        this.copyReactButton.textContent = 'Copy React';
      }, 3000);
    }
    navigator.clipboard.writeText(code);
  }

  ////// Accesibility

  private async runA11yTest() {
    try {
      const container = this.el.shadowRoot.getElementById('test-container');

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

  async componentWillLoad() {
    // Define lang attribute
    this.lang = assignLanguage(this.el);

    this.validateAttrs();
    this.validateSlots();
    this.validateEvents();

    this.displayElement = this.el.children[0];
  }

  async componentDidLoad() {
    this.formatCodePreview();
  }

  render() {
    return (
      <Host>
        <div class="display-frame">
          <slot></slot>
        </div>

        <div class="code-frame">
          <div class="code-actions">
            <gcds-button
              button-role="secondary"
              onClick={() => {
                this.showCode = !this.showCode;
              }}
            >
              {this.showCode ? 'Hide code' : 'Show code'}
            </gcds-button>

            {this.showCode && (
              <>
                <gcds-button
                  button-role="secondary"
                  name="html"
                  onClick={e => {
                    this.copyCode(e);
                  }}
                  ref={element => (this.copyHTMLButton = element as HTMLElement)}
                >
                  Copy HTML
                </gcds-button>
                <gcds-button
                  button-role="secondary"
                  name="react"
                  onClick={e => {
                    this.copyCode(e);
                  }}
                  ref={element => (this.copyReactButton = element as HTMLElement)}
                >
                  Copy React
                </gcds-button>
              </>
            )}
          </div>
          <div class={`code-preview${!this.showCode && ' hidden'}`}>
            <pre class="language-html">
              <code id="html" ref={element => (this.htmlCodePreview = element as HTMLElement)}></code>
            </pre>
            <pre class="language-html">
              <code id="react" ref={element => (this.reactCodePreview = element as HTMLElement)}></code>
            </pre>
          </div>
        </div>

        <div id="tabs">
          <div role="tablist">
            <gcds-button id="attributes" button-role="secondary" role="tab" onClick={() => this.setDisplay('attrs')} aria-selected={this.display === 'attrs' ? 'true' : 'false'}>
              Attributes & properties
            </gcds-button>
            {this.slotObject && (
              <gcds-button id="slots" button-role="secondary" role="tab" onClick={() => this.setDisplay('slots')} aria-selected={this.display === 'slots' ? 'true' : 'false'}>
                Slots
              </gcds-button>
            )}
            {this.eventObject && (
              <gcds-button id="events" button-role="secondary" role="tab" onClick={() => this.setDisplay('events')} aria-selected={this.display === 'events' ? 'true' : 'false'}>
                Events
              </gcds-button>
            )}
            {this.accessibility && (
              <gcds-button id="a11y" button-role="secondary" role="tab" onClick={() => this.setDisplay('a11y')} aria-selected={this.display === 'a11y' ? 'true' : 'false'}>
                Accessibility
              </gcds-button>
            )}
          </div>

          <div role="tabpanel" tabindex="0" class={this.display != 'attrs' && 'hidden'}>
            <table class="attributes">
              <tr>
                <th>Attributes</th>
                <th>Type</th>
                <th>Default value</th>
                <th>Control</th>
              </tr>
              {this.attributeObject &&
                this.attributeObject.map(attr => {
                  let control = '';

                  const displayValue = this.displayElement.getAttribute(attr.name) != null ? this.displayElement.getAttribute(attr.name) : attr?.defaultValue;

                  if (attr.control === 'select') {
                    const options = JSON.parse(attr.options);
                    // console.log(options);
                    control = (
                      <gcds-select
                        label={attr.name}
                        selectId={attr.name}
                        name={attr.name}
                        value={displayValue}
                        onInput={e => this.handleAttrInput(e)}
                        onChange={e => this.handleAttrInput(e)}
                      >
                        {options.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </gcds-select>
                    );
                  } else if (attr.control === 'text') {
                    control = (
                      <gcds-input
                        name={attr.name}
                        label={attr.name}
                        inputId={attr.name}
                        hide-label
                        type="text"
                        value={displayValue}
                        onInput={e => this.handleAttrInput(e)}
                        onChange={e => this.handleAttrInput(e)}
                      ></gcds-input>
                    );
                  }

                  return (
                    <tr>
                      <td>{attr.name}</td>
                      <td>{attr.type}</td>
                      <td>{attr?.defaultValue}</td>
                      <td>{control}</td>
                    </tr>
                  );
                })}
            </table>
          </div>

          {this.slotObject && (
            <div role="tabpanel" tabindex="0" class={this.display != 'slots' && 'hidden'}>
              <table class="slots">
                <caption>Slots allow passing text or HTML elements to the component.</caption>
                <tr>
                  <th>Slot name</th>
                  <th>Description</th>
                  <th>Control</th>
                </tr>

                {this.slotObject.map(slot => {
                  const controlValue = this.getSlotValue(slot.name);
                  const control = (
                    <gcds-textarea label={slot.name} textareaId={slot.name} name={slot.name} hideLabel value={controlValue} onChange={e => this.handleSlotInput(e)}></gcds-textarea>
                  );
                  return (
                    <tr>
                      <td>{slot.name}</td>
                      <td>{slot.description}</td>
                      <td>{control}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          )}

          {this.eventObject && (
            <div role="tabpanel" tabindex="0" class={this.display != 'events' && 'hidden'}>
              <table class="events">
                <caption>Custom events the component has</caption>
                <tr>
                  <th>Event name</th>
                  <th>Description</th>
                  <th>Details</th>
                </tr>

                {this.eventObject.map(event => {
                  return (
                    <tr class={event.name}>
                      <td>{event.name}</td>
                      <td>{event.description}</td>
                      <td>{event.details}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          )}

          {this.accessibility && (
            <div role="tabpanel" tabindex="0" class={`tabs--accessibility${this.display != 'a11y' ? ' hidden' : ''}`}>
              <gcds-button
                button-role="secondary"
                onClick={async () => {
                  await this.runA11yTest();
                }}
              >
                Run accessibility test
              </gcds-button>

              <p aria-live="polite">
                {this.axeResults && this.axeResults.violations.length > 0
                  ? `${this.axeResults.violations.length} issue(s) found. Please reference table below for more details.`
                  : this.axeResults && `No issues found. Please reference table below to see passed tests.`}
              </p>

              <div id="test-container" class=""></div>

              {this.renderAxeResultsTable()}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
