import { EventEmitter } from '../../stencil-public-runtime';
import { AttributesType } from '../../utils/utils';
export declare class AttributeTab {
    el: HTMLElement;
    private valueChecker;
    private lastInputValue;
    attributeObject: Array<AttributesType>;
    displayElement: Element;
    attributeChange: EventEmitter<Object>;
    statusUpdate: EventEmitter<Object>;
    lang: string;
    lastInputTimestamp: any[];
    private formatEventDetail;
    private onFocusStartInterval;
    private onBlurClearInterval;
    componentWillLoad(): Promise<void>;
    render(): any;
}
