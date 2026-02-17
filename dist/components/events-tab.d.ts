import type { Components, JSX } from "../types/components";

interface EventsTab extends Components.EventsTab, HTMLElement {}
export const EventsTab: {
    prototype: EventsTab;
    new (): EventsTab;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
