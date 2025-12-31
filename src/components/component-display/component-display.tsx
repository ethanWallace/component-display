import { Component, Host, h, Prop, Watch, Element, State, Listen } from '@stencil/core';

import { assignLanguage, removeUnwantedAttributes, AttributesType, SlotType, EventType } from '../../utils/utils';

@Component({
  tag: 'component-display',
  styleUrls: ['component-display.css'],
  shadow: true,
})
export class ComponentDisplay {
  @Element() el: HTMLElement;

  private displayElement?: Element;
  private slotHistory: object = [];
  private attributeObject;
  private slotObject;
  private eventObject;

  /* ---------------------------
   * Props + validation
   * --------------------------- */

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

    this.slotObject?.forEach(slot => {
      if (slot.name === 'default') {
        this.slotHistory[slot.name] = this.displayElement.innerHTML;
      } else {
        const el = this.displayElement.querySelector(`[slot="${slot.name}"]`) as HTMLElement;

        this.slotHistory[slot.name] = el ? removeUnwantedAttributes(el.outerHTML) : '';
      }
    });
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

  /* ---------------------------
   * State
   * --------------------------- */

  @State() display: 'attrs' | 'slots' | 'events' | 'a11y' = 'attrs';
  @State() lang = 'en';
  @State() codeSource = '';

  /* ---------------------------
   * Listeners
   * --------------------------- */

  @Listen('attributeChange', { target: 'document' })
  attributeChangeListener(e) {
    if (e.target === this.el) {
      this.displayElement.setAttribute(e.detail.name, e.detail.value);
      this.updateCodePreview();
    }
  }

  @Listen('slotValueChange', { target: 'document' })
  slotValueChangeListener(e) {
    if (e.target === this.el) {
      this.slotHistory[e.detail.name] = e.detail.value;
      this.renderSlotContent();
      this.updateCodePreview();
    }
  }

  /* ---------------------------
   * Lifecycle
   * --------------------------- */

  async componentWillLoad() {
    // Define lang attribute
    this.lang = assignLanguage(this.el);
    this.displayElement = this.el.children[0];

    this.validateAttrs();
    this.validateSlots();
    this.validateEvents();

    this.updateCodePreview();
  }

  /* ---------------------------
   * Helpers
   * --------------------------- */

  // Add slot content to the component display
  private renderSlotContent() {
    this.displayElement.innerHTML = '';

    Object.values(this.slotHistory).forEach(content => {
      this.displayElement.innerHTML += content;
    });
  }

  private updateCodePreview() {
    this.codeSource = removeUnwantedAttributes(this.el.innerHTML);
  }

  private setDisplay(tab: typeof this.display) {
    this.display = tab;
  }

  /* ---------------------------
   * Render
   * --------------------------- */

  render() {
    return (
      <Host>
        {/* Component + code preview */}
        <code-frame source={this.codeSource}>
          <slot></slot>
        </code-frame>

        {/* Tabs */}
        {this.attributeObject || this.slotObject || this.eventObject || this.accessibility ? (
          <div id="tabs">
            <gcds-heading tag="h4">Component API</gcds-heading>
            <div role="tablist">
              {this.attributeObject && (
                <gcds-button
                  id="attributes"
                  button-role="secondary"
                  role="tab"
                  onClick={() => this.setDisplay('attrs')}
                  aria-selected={this.display === 'attrs' ? 'true' : 'false'}
                >
                  Attributes
                </gcds-button>
              )}
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

            {this.attributeObject && (
              <attribute-tab displayElement={this.displayElement} attributeObject={this.attributeObject} class={this.display != 'attrs' && 'hidden'}></attribute-tab>
            )}

            {this.slotObject && (
              <slots-tab displayElement={this.displayElement} slotObject={this.slotObject} slotHistory={this.slotHistory} class={this.display != 'slots' && 'hidden'}></slots-tab>
            )}

            {this.eventObject && <events-tab eventObject={this.eventObject} class={this.display != 'events' && 'hidden'}></events-tab>}

            {this.accessibility && (
              <accessibility-tab displayElement={this.displayElement} class={`tabs--accessibility${this.display != 'a11y' ? ' hidden' : ''}`} lang={this.lang}></accessibility-tab>
            )}
          </div>
        ) : null}
      </Host>
    );
  }
}
