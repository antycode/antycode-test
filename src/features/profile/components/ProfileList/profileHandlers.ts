import {ipcRenderer} from 'electron';

interface ICheckProxyParams {
    type: string,
    host: string,
    port: number
};

export function openNewWindow(chromiumParams: string[] | null,
                              proxyParams: string[] | null, profileId: string, profileParams: {
        [key: string]: any
    }, userExtensions: { id: string, external_id: string, url: string, is_public: boolean, title: string }[], browserParams: { version: string, naclArch: string }) {
    ipcRenderer.send('openChromium', chromiumParams, proxyParams, profileId, profileParams, userExtensions, browserParams);
};

export function closeWindowProcess(pidProcess: number) {
    ipcRenderer.send('killProcess', pidProcess);
};

// export function checkProxy(proxyParams: ICheckProxyParams) {
//     ipcRenderer.send('checkProxy', proxyParams);
// };