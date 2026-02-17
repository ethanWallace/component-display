import axe from 'axe-core';
export declare class AccessibilityTab {
    el: HTMLElement;
    displayElement: Element;
    landmarkDisplay?: boolean;
    axeResults: axe.AxeResults | null;
    testRunning: boolean;
    lang: string;
    private runA11yTest;
    renderAxeResultsTable(): any;
    componentWillLoad(): Promise<void>;
    render(): any;
}
