import { EventEmitter } from '../../stencil-public-runtime';
import { SlotType } from '../../utils/utils';
export declare class SlotsTab {
    el: HTMLElement;
    private valueChecker;
    private lastInputValue;
    slotObject: Array<SlotType>;
    displayElement: Element;
    slotHistory: Object;
    slotValueChange: EventEmitter<Object>;
    statusUpdate: EventEmitter<Object>;
    lang: string;
    slotErrors: {
        [k: string]: string;
    };
    lastInputTimestamp: any[];
    private emitSlotEvent;
    private onFocusStartInterval;
    private onBlurClearInterval;
    componentWillLoad(): Promise<void>;
    render(): any;
}
