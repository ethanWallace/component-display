import { EventType } from '../../utils/utils';
export declare class EventsTab {
    el: HTMLElement;
    eventObject: Array<EventType>;
    lang: string;
    componentWillLoad(): Promise<void>;
    render(): any;
}
