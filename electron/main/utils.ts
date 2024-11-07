import {platform} from 'os';
import path from 'path';
import {app} from 'electron';

export const getPlatform = (): string => {

    switch (platform()) {
        case 'aix':
        case 'freebsd':
        case 'linux':
        case 'openbsd':
        case 'android':
            return 'linux';
        case 'darwin':
        case 'sunos':
            return 'mac';
        case 'win32':
            return 'win';
        default:
            return ''
    }
};

export const getChromiumBinaryPath = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;
    let binariesPath = isPackaged
        ? path.join(process.resourcesPath, '..', './Resources', getPlatform(), './bin')
        : path.join(root, './resources', getPlatform(), './bin');

    switch (getPlatform()) {
        case 'mac':
            binariesPath = path.join(binariesPath, './Chromium.app/Contents/MacOS/AntyCodeWebBrowser');
            break;
        case 'win':
            binariesPath = path.join(binariesPath, './chromium')
            break;
        case 'linux':
            binariesPath = path.join(binariesPath, './chrome-linux/chrome')
            break;
        default:
            binariesPath = path.join(binariesPath, './Chromium.app/Contents/MacOS/Chromium');
    }

    return path.resolve(binariesPath);
}

export const getMassImportTemplate = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;
    let binariesPath = isPackaged
        ? path.join(process.resourcesPath, '..', './Resources', './templateMassImport', './Import-template-anty-code.xlsx')
        : path.join(root, './resources', './templateMassImport', './Import-template-anty-code.xlsx');

    return path.resolve(binariesPath);
}

export const getCookieBinaryPath = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;
    let cookiePath = isPackaged
        ? path.join(process.resourcesPath, '..', './Resources', getPlatform(), './cookie')
        : path.join(root, './resources', getPlatform(), './cookie');

    switch (getPlatform()) {
        case 'mac':
            cookiePath = path.join(cookiePath, './chromecookiestealer');
            break;
        case 'win':
            cookiePath = path.join(cookiePath, './chromecookiestealer.exe')
            break;
        case 'linux':
            cookiePath = path.join(cookiePath, './chromecookiestealer')
            break;
        default:
            cookiePath = path.join(cookiePath, './chromecookiestealer');
    }

    return path.resolve(cookiePath);
}

export const getProfileTemplatePath = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;
    let profilesPath = isPackaged
        ? path.join(process.resourcesPath, '..', './Resources', './profileTemplate')
        : path.join(root, './resources', './profileTemplate');

    return path.resolve(profilesPath);
}

export const getProfilesPath = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;
    let profilesPath = isPackaged
        ? app.getPath('userData') // --user-data-dir
        : path.join(root);

    return path.resolve(profilesPath);
}

export const getAppPath = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;
    let profilesPath = isPackaged
        ? app.getPath('userData') // --user-data-dir
        : path.join(root);

    return path.resolve(profilesPath);
}


export const getCertsPath = () => {
    const {isPackaged} = app;
    const root = process.cwd();
    const gcpPath = isPackaged
        ? path.join(process.resourcesPath, '..', './Resources', 'certs.json')
        : path.join(root, 'certs.json');

    return path.resolve(gcpPath);
}

export const getExtensionsPath = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;

    let extensionsPath = isPackaged
        ? path.join(app.getPath('userData'), 'extensions')
        : path.join(root, 'extensions');

    return path.resolve(extensionsPath);
};

export const getTunnelFilePath = (): string => {
    const root = process.cwd();
    const {isPackaged} = app;
    let tunnelPath = isPackaged
        ? path.join(process.resourcesPath, '..', './Resources', getPlatform(), './tunnel')
        : path.join(root, './resources', getPlatform(), './tunnel');
    switch (getPlatform()) {
        case 'mac':
            tunnelPath = path.join(tunnelPath, './tunnel_m1/tunnel');
            break;
        case 'win':
            tunnelPath = path.join(tunnelPath, './tunnel.exe');
            break;
        case 'linux':
            tunnelPath = path.join(tunnelPath, './tun-linux');
            break;
        default:
            tunnelPath = path.join(tunnelPath, './tunnel_m1/tunnel');
    }
    return path.resolve(tunnelPath);
}

export const generateCrxDownloadUrl = (extensionId: string, version: string, naclArch: string): string => {
    return `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${version}&x=id%3D${extensionId}%26installsource%3Dondemand%26uc&nacl_arch=${naclArch}&acceptformat=crx2,crx3`;
};
