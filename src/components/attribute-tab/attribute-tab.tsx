import { Component, Host, h, Element, Prop, Event, EventEmitter, State } from '@stencil/core';

import { AttributesType, assignLanguage, closestElement } from '../../utils/utils';

@Component({
  tag: 'attribute-tab',
  styleUrl: 'attribute-tab.css',
  shadow: false,
})
export class AttributeTab {
  @Element() el: HTMLElement;

  @Prop() attributeObject: Array<AttributesType>;
  @Prop() displayElement!: Element;

  @Event() attributeChange!: EventEmitter<Object>;

  @State() lang: string = 'en';

  private formatEventDetail(e) {
    const eventDetail = {
      name: e.target.name,
      value: e.target.value,
    }

    this.attributeChange.emit(eventDetail);
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

              let displayValue = this.displayElement.getAttribute(attr.name) != null ? this.displayElement.getAttribute(attr.name) : attr?.defaultValue;

              // Special case for lang attribute to inherit from closest parent with lang attribute
              if (attr.name === 'lang') {
                displayValue = closestElement('[lang]', this.displayElement).getAttribute('lang') || displayValue;
              }

              if (attr.control === 'select') {
                const options = typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options;

                control = (
                  <gcds-select
                    label={attr.name}
                    selectId={attr.name}
                    name={attr.name}
                    value={displayValue}
                    hide-label
                    onInput={(e) => this.formatEventDetail(e)}
                  >
                    {typeof options === 'object' && options.map(option => (
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
                    onInput={(e) => this.formatEventDetail(e)}
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
      </Host>
    );
  }
}
