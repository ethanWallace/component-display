import type { Components, JSX } from "../types/components";

interface ComponentDisplay extends Components.ComponentDisplay, HTMLElement {}
export const ComponentDisplay: {
    prototype: ComponentDisplay;
    new (): ComponentDisplay;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
