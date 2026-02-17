import type { Components, JSX } from "../types/components";

interface AttributeTab extends Components.AttributeTab, HTMLElement {}
export const AttributeTab: {
    prototype: AttributeTab;
    new (): AttributeTab;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
