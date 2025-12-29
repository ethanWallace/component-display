import { Component, Host, h, Element, Prop, Event, EventEmitter, State } from '@stencil/core';
import DOMPurify from 'dompurify';

import { assignLanguage, SlotType } from '../../utils/utils';

@Component({
  tag: 'slots-tab',
  styleUrl: 'slots-tab.css',
  shadow: false,
})
export class SlotsTab {
  @Element() el: HTMLElement;

  @Prop() slotObject: Array<SlotType>;
  @Prop() displayElement!: Element;
  @Prop() slotHistory: Object;

  @Event() slotValueChange!: EventEmitter<Object>;

  @State() lang: string = 'en';
  @State() slotErrors: { [k: string]: string } = {};

  /*
  * Sanitize and emit slot change event
  */
  private emitSlotEvent(e) {
    const sanitizedValue = DOMPurify.sanitize(e.target.value, {
      CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: /^gcds-/,
        attributeNameCheck: /.*/,
        allowCustomizedBuiltInElements: false,
      },
      ADD_ATTR: ['slot'],
    });

    const textarea = e.target as HTMLGcdsTextareaElement;
    const name = textarea.name;

    // Prevent emitting invalid slot content for slots
    if (textarea.value.trim() !== '') {
      // Check if the slot content includes the correct slot attribute
      if (name !== 'default' && !textarea.value.includes(`slot="${name}"`)) {
        this.slotErrors = { ...this.slotErrors, [name]: `Content for the "${name}" slot must include the attribute slot="${name}".` };
        return;
      }
      if (sanitizedValue !== textarea.value) {
        this.slotErrors = { ...this.slotErrors, [name]: 'The slot content contains invalid or unsafe HTML and has been sanitized.' };
        return;
      }
    }

    // clear error for that slot
    this.slotErrors = { ...this.slotErrors, [name]: '' };

    const eventDetail = {
      name,
      value: sanitizedValue,
    }

    this.slotValueChange.emit(eventDetail);
  }

  async componentWillLoad() {
    this.lang = assignLanguage(this.el);
  }

  render() {
    return (
      <Host
        role="tabpanel"
        tabindex="0"
      >
        <table class="slots">
          <caption>Slots allow passing text or HTML elements to the component. Modify the HTML values to update the displayed component.</caption>
          <tr>
            <th>Slot name</th>
            <th>Description</th>
            <th>Control</th>
          </tr>

          {this.slotObject.map(slot => {
            const control = (
              <gcds-textarea
                label={slot.name}
                textareaId={slot.name}
                name={slot.name}
                hideLabel
                value={this.slotHistory[slot.name]}
                error-message={this.slotErrors[slot.name]}
                validate-on="other"
                onChange={e => this.emitSlotEvent(e)}
                lang={this.lang}
              ></gcds-textarea>
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
      </Host>
    );
  }
}
