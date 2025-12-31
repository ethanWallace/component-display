export const assignLanguage = (el: HTMLElement) => {
  let lang = '';
  if (!el.getAttribute('lang')) {
    const closestLangAttribute = closestElement('[lang]', el)?.getAttribute('lang');
    if (closestLangAttribute == 'en' || !closestLangAttribute) {
      lang = 'en';
    } else {
      lang = 'fr';
    }
  } else if (el.getAttribute('lang') == 'en') {
    lang = 'en';
  } else {
    lang = 'fr';
  }

  return lang;
};

// Allows use of closest() function across shadow boundaries
export const closestElement = (selector, el) => {
  if (el) {
    return (el && el != document && typeof window != 'undefined' && el != window && el.closest(selector)) || closestElement(selector, el.getRootNode().host);
  }

  return null;
};

// Removes unwanted attributes from display element
export const removeUnwantedAttributes = html => {
  const regex = /\s*(aria-[a-z-]+|class|(?<!-)\brole\b)="[^"]*"/g;
  return html.replace(regex, '');
};

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

export const srcDoc = `<!DOCTYPE html>
<html lang="{{lang}}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Landmark Elements</title>
  <link rel="stylesheet" href="./gcds/gcds.css" />
  <script type="module" src="./gcds/gcds.esm.js"></script>
  <link
    rel="stylesheet"
    href="https://cdn.design-system.alpha.canada.ca/@gcds-core/css-shortcuts@latest/dist/gcds-css-shortcuts.min.css"
  />
  {{axeScript}}
</head>
<body>
  {{displayElement}}
</body>
</html>`;

export const formatSrcDoc = (displayElement: string, accessibility: boolean = false, lang: string = 'en') => {
  let doc = srcDoc;
  if (accessibility) {
    const axeScript = `<script src="https://cdn.jsdelivr.net/npm/axe-core@4.7.2/axe.min.js"></script>`;
    doc = doc.replace('{{axeScript}}', axeScript);
  } else {
    doc = doc.replace('{{axeScript}}', '');
  }
  doc = doc.replace('{{lang}}', lang);
  doc = doc.replace('{{displayElement}}', displayElement);

  return doc;
};
