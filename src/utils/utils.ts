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
