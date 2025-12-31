# Component display

A proof of concept web component to replace the use of stroybook on the [GC Design System documentation site](https://github.com/cds-snc/gcds-docs).

This component uses the [GC Design System](https://design-system.alpha.canada.ca/en/).

## Features

### Code preview

Show the rendered component and the HTML used to render the component

#### Code preview todo

- [X] Cleaner display
- [ ] Ability to show code examples for each supported framework (there are small differences in the way they handle attributes) and copy them directly
- [ ] How to handle landmark components (like `gcds-header`). If more than one on a page we will get flagged for accessibility everytime even though it is clearly an example.

### Properties/attributes table

A table that renders all available component properties allowing users to modify the properties and see how the component changes.

#### Properties/attributes todo

- [ ] Allow easy selection of options.
- [ ] Accessibile/bilingual controls.
- [ ] Read only properties (ex: validity on form components).
- [ ] (**stretch**) Conditional fields/properties: Example would be "disabling" `href` row on `gcds-button` when `type` is not `link`.

### Slots

A table showing the available slots in the component with a textarea able to modify the HTML content.

#### Slots todo

- [X] Rewrite the slot changing logic (it was done quickly)
- [X] Only allow HTML to be entered if it contains `slot="<name>"` in textarea
- [X] HTML sanitization

### Events

A table that lists custom events that the component emits.

#### Events todo

- [ ] Custom events are listed with the expected event detail
- [ ] (**stretch**) Enable an event listener that signals when the component is firing the event in the preview
- [ ] (**stretch**) Allow custom event listener: text input that allows user to type in an event for the component to listen to

### Accessibility

A tab that gives the option to run axe-core accessibility test right on the live component and lists the results.

#### Accessibility todo

- [ ] Bilingual results (currently the table is only English)

## Component display todos

These are items to do that don't directly tie into one single feature.

- [X] General style cleanup. Make it look pretty.
- [ ] Tab accessibility
- [ ] How to handle smaller layouts
- [ ] (**stretch**) Figure out if we can make it render the properties, slot and events tables using the components manifest (`component.json`) to save time writing out each `component-display` manually.
