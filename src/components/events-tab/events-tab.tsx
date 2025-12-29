import { Component, Host, h, Element, Prop, State } from '@stencil/core';

import { EventType, assignLanguage } from '../../utils/utils';

@Component({
  tag: 'events-tab',
  styleUrl: 'events-tab.css',
  shadow: false,
})
export class EventsTab {
  @Element() el: HTMLElement;

  @Prop() eventObject: Array<EventType>;

  @State() lang: string = 'en';

  async componentWillLoad() {
    this.lang = assignLanguage(this.el);
  }

  render() {
    return (
      <Host
        role="tabpanel"
        tabindex="0"
      >
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
      </Host>
    );
  }
}
