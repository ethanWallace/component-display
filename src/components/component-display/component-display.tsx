import { Component, Host, h, Prop, Watch, Element, State, Listen } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import prettier from 'prettier/standalone';
import prettierPluginHTML from 'prettier/plugins/html';

import { assignLanguage, removeUnwantedAttributes, AttributesType, SlotType, EventType } from '../../utils/utils';

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
  @State() lang: string = 'en';

  private setDisplay(str) {
    this.display = str;
  }

  @Listen('attributeChange', { target: 'document' })
  attributeChangeListener(e) {
    this.displayElement.setAttribute(e.detail.name, e.detail.value);
    this.formatCodePreview();
  }

  @Listen('slotValueChange', { target: 'document' })
  slotValueChangeListener(e) {
    if (e.detail.name === 'default') {
      this.displayElement.innerHTML = this.displayElement.innerHTML.replace(this.displayElement.innerHTML, e.detail.value);
    }

    this.displayElement.innerHTML = removeUnwantedAttributes(this.displayElement.innerHTML).replace(this.slotHistory[e.detail.name], e.detail.value);

    this.slotHistory[e.detail.name] = e.detail.value;

    this.formatCodePreview();
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

  private async formatCodePreview() {
    const code = await prettier.format(removeUnwantedAttributes(this.el.innerHTML), { parser: 'html', plugins: [prettierPluginHTML] });
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

          <attribute-tab
            displayElement={this.displayElement}
            attributeObject={this.attributeObject}
            class={this.display != 'attrs' && 'hidden'}
          ></attribute-tab>

          {this.slotObject && (
            <slots-tab
              displayElement={this.displayElement}
              slotObject={this.slotObject}
              slotHistory={this.slotHistory}
              class={this.display != 'slots' && 'hidden'}
            ></slots-tab>
          )}

          {this.eventObject && (
            <events-tab
              eventObject={this.eventObject}
              class={this.display != 'events' && 'hidden'}
            ></events-tab>
          )}

          {this.accessibility && (
            <accessibility-tab
              displayElement={this.displayElement}
              class={`tabs--accessibility${this.display != 'a11y' ? ' hidden' : ''}`}
              lang={this.lang}
            ></accessibility-tab>
          )
          }
        </div>
      </Host >
    );
  }
}
