import type { Components, JSX } from "../types/components";

interface SlotsTab extends Components.SlotsTab, HTMLElement {}
export const SlotsTab: {
    prototype: SlotsTab;
    new (): SlotsTab;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
