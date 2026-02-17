export declare const assignLanguage: (el: HTMLElement) => string;
export declare const closestElement: (selector: any, el: any) => any;
export declare const removeUnwantedAttributes: (html: any) => any;
export type AttributesType = {
    name: string;
    control: 'select' | 'text' | 'none';
    options?: Array<string>;
    required?: boolean;
    defaultValue?: string;
    type?: string;
    onlyProperty?: boolean;
};
export type SlotType = {
    name: string;
    description: string;
};
export type EventType = {
    name: string;
    description: string;
    details: string | object;
};
export declare const srcDoc = "<!DOCTYPE html>\n<html lang=\"{{lang}}\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Landmark Elements</title>\n  <link rel=\"stylesheet\" href=\"/components/dist/gcds.css\" />\n  <script type=\"module\" src=\"/components/dist/gcds.esm.js\"></script>\n  <link\n    rel=\"stylesheet\"\n    href=\"https://cdn.design-system.alpha.canada.ca/@gcds-core/css-shortcuts@latest/dist/gcds-css-shortcuts.min.css\"\n  />\n  {{axeScript}}\n</head>\n<body class=\"p-150\">\n  {{displayElement}}\n</body>\n</html>";
export declare const formatSrcDoc: (displayElement: string, accessibility?: boolean, lang?: string) => string;
export declare const formatDataLabel: (label: string, lang: string) => string;
export declare const iframeListeners: (iframe: HTMLIFrameElement) => void;
