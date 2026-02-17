'use strict';

var index = require('./index-C2KjgQTY.js');
var appGlobals = require('./app-globals-V2Kpy_OQ.js');

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await appGlobals.globalScripts();
  return index.bootstrapLazy([["accessibility-tab_6.cjs",[[1,"component-display",{"attrs":[1],"slots":[1],"events":[1],"accessibility":[4],"landmarkDisplay":[4,"landmark-display"],"framework":[1],"display":[32],"lang":[32],"codeSource":[32]},[[4,"attributeChange","attributeChangeListener"],[4,"statusUpdate","statusUpdateListener"],[4,"slotValueChange","slotValueChangeListener"],[4,"keydown","keyDownListener"]],{"attrs":["validateAttrs"],"slots":["validateSlots"],"events":["validateEvents"]}],[0,"accessibility-tab",{"displayElement":[16,"display-element"],"landmarkDisplay":[4,"landmark-display"],"axeResults":[32],"testRunning":[32],"lang":[32]}],[0,"attribute-tab",{"attributeObject":[16,"attribute-object"],"displayElement":[16,"display-element"],"lang":[32],"lastInputTimestamp":[32]}],[1,"code-frame",{"source":[1],"landmarkDisplay":[4,"landmark-display"],"accessibility":[4],"framework":[1],"showCode":[32],"activeFormat":[32],"htmlCode":[32],"reactCode":[32],"vueCode":[32],"angularCode":[32],"copyLabel":[32],"lang":[32]},null,{"source":["onSourceChange"],"framework":["onFrameworkChange"]}],[0,"events-tab",{"eventObject":[16,"event-object"],"lang":[32]}],[0,"slots-tab",{"slotObject":[16,"slot-object"],"displayElement":[16,"display-element"],"slotHistory":[16,"slot-history"],"lang":[32],"slotErrors":[32],"lastInputTimestamp":[32]}]]]], options);
};

exports.setNonce = index.setNonce;
exports.defineCustomElements = defineCustomElements;
//# sourceMappingURL=loader.cjs.js.map

//# sourceMappingURL=loader.cjs.js.map