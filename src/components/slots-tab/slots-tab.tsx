import { Component, Host, h, Element, Prop, Event, EventEmitter, State } from '@stencil/core';

import { assignLanguage, removeUnwantedAttributes, SlotType } from '../../utils/utils';

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

  private getSlotValue(name) {
    if (name === 'default') {
      return this.displayElement.innerHTML;
    }

    if (this.displayElement.querySelector(`[slot="${name}"]`)) {
      this.slotHistory[name] = removeUnwantedAttributes(this.displayElement.querySelector(`[slot="${name}"]`)?.outerHTML);
      return this.slotHistory[name];
    }

    return '';
  }

  private formatEventDetail(e) {
    const eventDetail = {
      name: e.target.name,
      value: e.target.value,
    }

    this.slotValueChange.emit(eventDetail);
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
              <gcds-textarea
                label={slot.name}
                textareaId={slot.name}
                name={slot.name}
                hideLabel
                value={controlValue}
                onChange={e => this.formatEventDetail(e)}
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
