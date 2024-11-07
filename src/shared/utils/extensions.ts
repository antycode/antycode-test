import {ipcRenderer} from 'electron';

export const fetchExtensionData = async (extensionUrl: string): Promise<any> => {
    return new Promise((resolve) => {
        ipcRenderer
            .invoke('fetch-extension-icon', extensionUrl)
            .then((data: string | null) => {
                resolve(data);
            })
            .catch((error: any) => {
                console.error('Error fetching data:', error);
                resolve(null);
            });
    });
};

export const extractExtensionId = (extensionUrl: string): string => {
    const cleanUrl = extensionUrl.split('?')[0];
    const parts = cleanUrl.split('/');
    return parts.length > 0 ? parts[parts.length - 1] : '';
};

export const generateCrxDownloadUrl = (extensionId: string): string => {
    let currentVersion = getChromeVersion();
    let version = currentVersion?.major + "." + currentVersion?.minor + "." + currentVersion?.build + "." + currentVersion?.patch;
    const naclArch = getNaclArch();
    console.log('version&naclArch', version, ' ', naclArch)
    return `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${version}&x=id%3D${extensionId}%26installsource%3Dondemand%26uc&nacl_arch=${naclArch}&acceptformat=crx2,crx3`;
};

export function getNaclArch() {
    let nacl_arch = 'arm';
    if (navigator.userAgent.indexOf('x86') > 0) {
        nacl_arch = 'x86-32';
    } else if (navigator.userAgent.indexOf('x64') > 0) {
        nacl_arch = 'x86-64';
    }
    return nacl_arch;
}

export function getChromeVersion() {
    let pieces: any = navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/);
    if (pieces == null || pieces.length != 5) {
        return undefined;
    }
    pieces = pieces.map((piece: any) => parseInt(piece, 10));
    return {
        major: pieces[1],
        minor: pieces[2],
        build: pieces[3],
        patch: pieces[4]
    };
}

export const handleDownloadExtension = async (extensionUrl: string) => {

    const extensionId = extractExtensionId(extensionUrl);
    const downloadUrl = generateCrxDownloadUrl(extensionId);

    try {
        const result = await ipcRenderer.invoke('download-extension', downloadUrl, extensionId);
        if (result.success) {
            console.log('Расширение успешно скачано и сохранено в:', result.path);
        } else {
            console.error('Ошибка:', result.error);
        }
    } catch (error) {
        console.error('Ошибка при вызове IPC:', error);
    }
};
