import { ipcRenderer } from 'electron';

interface ICheckProxyParams {
    type: string,
    host: string,
    port: number
};

export function openNewWindow(chromiumParams: string[],
    proxyParams: string[] = [], profileId: string) {
    ipcRenderer.send('openChromium', chromiumParams, proxyParams, profileId);
};

export function closeWindowProcess(pidProcess: number) {
    ipcRenderer.send('killProcess', pidProcess);
};

export function checkProxy(proxyParams: ICheckProxyParams) {
    ipcRenderer.send('checkProxy', proxyParams);
};