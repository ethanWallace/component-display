// Script to generate component metadata from Stencil JSON output
// Usage: node scripts/generate-gcds-props.js <path-to-components.json> [output-file]

import fs from 'fs';
import path from 'path';

const [, , inputArg, outputArg] = process.argv;

if (!inputArg) {
  console.error('Usage: node generate-component-meta.js <path-to-components.json> [output-file]');
  process.exit(1);
}

const INPUT = path.resolve(process.cwd(), inputArg);
const OUTPUT = path.resolve(process.cwd(), outputArg || 'component-meta.js');

if (!fs.existsSync(INPUT)) {
  console.error(`File not found: ${INPUT}`);
  process.exit(1);
}

const raw = fs.readFileSync(INPUT, 'utf-8');
const data = JSON.parse(raw);

function controlFromProp(prop) {
  // Boolean → select true/false
  if (prop.type === 'boolean' || prop.complexType?.resolved === 'boolean') {
    return 'select';
  }

  // Union / enum → select
  if (prop.values && prop.values.length > 1) {
    return 'select';
  }

  return 'text';
}

function normalizeDefault(value) {
  if (!value) return undefined;
  return value.replace(/^'|'$/g, '');
}

function propToAttribute(prop) {
  const attrName = prop.attr || prop.name;
  const resolvedType = prop.complexType?.resolved || prop.type;

  const attribute = {
    name: attrName,
    control: controlFromProp(prop),
    type: resolvedType,
  };

  if (prop.required) attribute.required = true;

  // Defaults
  if (prop.default !== undefined) {
    attribute.defaultValue = normalizeDefault(prop.default);
  }

  // Boolean → options ["true","false"]
  if (resolvedType === 'boolean') {
    attribute.options = ['true', 'false'];
  }

  // Union / enum → options
  else if (prop.values && prop.values.length > 1) {
    attribute.options = prop.values.filter(v => v.value !== undefined).map(v => String(v.value));
  }

  // readonly props → onlyProperty
  if (prop.getter && !prop.setter) {
    attribute.onlyProperty = true;
  }

  return attribute;
}

function slotToSlotType(slot) {
  return {
    name: slot.name,
    description: slot.docs || '',
  };
}

function eventToEventType(event) {
  return {
    name: event.event,
    description: event.docs || '',
    details: event.complexType?.resolved || event.detail || 'void',
  };
}

function toExportName(tag) {
  // gcds-alert → gcdsAlert
  return tag.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

let output = `// AUTO-GENERATED — DO NOT EDIT\n\n`;

for (const component of data.components) {
  const exportName = toExportName(component.tag);

  const attributes = (component.props || []).map(propToAttribute);
  const slots = (component.slots || []).map(slotToSlotType);
  const events = (component.events || []).map(eventToEventType);

  const block = {
    tag: component.tag,
    attributes,
    slots,
    events,
  };

  output += `export const ${exportName} = ${JSON.stringify(block, null, 2)};\n\n`;
}

fs.writeFileSync(OUTPUT, output);

console.log(`Generated ${OUTPUT}`);
