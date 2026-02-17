import type { Components, JSX } from "../types/components";

interface CodeFrame extends Components.CodeFrame, HTMLElement {}
export const CodeFrame: {
    prototype: CodeFrame;
    new (): CodeFrame;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
