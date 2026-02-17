import type { Components, JSX } from "../types/components";

interface AccessibilityTab extends Components.AccessibilityTab, HTMLElement {}
export const AccessibilityTab: {
    prototype: AccessibilityTab;
    new (): AccessibilityTab;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
