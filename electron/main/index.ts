import { app, BrowserWindow, shell, ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import process from 'process';
import { release } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'child_process';
import { performance } from 'perf_hooks';
import cheerio from 'cheerio';
import yauzl from 'yauzl';
import AdmZip from 'adm-zip';

const { globalShortcut } = require('electron');

const { Notification } = require('electron');
import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';

const { Storage } = require('@google-cloud/storage');
const log = require('electron-log');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

log.transports.file.resolvePathFn = () => path.join('D:\Job\It\Electron\zzaghaev-core-1611d2a40805', 'logs/main.log');

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload

const preload = join(__dirname, '../preload/index.js');
import {
  getTunnelFilePath,
  getChromiumBinaryPath,
  getCookieBinaryPath,
  getProfilesPath,
  getProfileTemplatePath,
  getMassImportTemplate,
  getExtensionsPath,
  generateCrxDownloadUrl,
  getAppPath,
  getCertsPath,
} from './utils';

import { readFile } from 'node:fs';
import axios from 'axios';
import { useExtensionsStore } from '@/features/account/components/ExtensionList/store';
import { startUpdate } from './update';

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
let storage: any;
let bucket: any;

app.whenReady().then(async () => {
  storage = new Storage({
    keyFilename: getCertsPath(),
  });
  bucket = storage.bucket('zproxy-mysql-backups');
  createWindow();
});

async function createWindow() {
  win = new BrowserWindow({
    title: 'anty-code',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 1280,
    height: 780,
    minWidth: 1200,
    minHeight: 800,
  });

  win.setMenu(null);

  if (url) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
    startUpdate(win, log);
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
    win?.maximize(); // Maximize window after loading
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Active Chromium Processes
  let chromiumProcesses: any[] = [];

  const isPortInUse = (port: number) => {
    return chromiumProcesses.find((chromiumProcess) => chromiumProcess.port === port);
  };

  // Copy template to profile directory after start chrome
  const copyFolderRecursive = async (source: string, target: string) => {
    console.log('Copying from', source, 'to', target);
    const files = await fs.promises.readdir(source);
    for (const file of files) {
      const currentSource = `${source}/${file}`;
      const currentTarget = `${target}/${file}`;
      if (fs.lstatSync(currentSource).isDirectory()) {
        await fs.promises.mkdir(currentTarget, { recursive: true });
        await copyFolderRecursive(currentSource, currentTarget);
      } else {
        await fs.promises.copyFile(currentSource, currentTarget);
      }
    }
  };

  async function getExtensionBucketByUrl(title: string, extensionId: any) {
    console.log('getExtensionBucketByUrl title:', title);
    try {
      const extensionsDir = getExtensionsPath();
      await ensureExtensionsDirectoryExists();
      const [files] = await storage.bucket('zproxy-mysql-backups').getFiles();
      console.log('Files:');
      files.forEach((file: any) => {
        console.log('Files:', file.name);
      });

      const zipPath = path.join(extensionsDir, `${extensionId}.zip`);
      const options = { destination: zipPath };
      console.log(`Starting download of ${title} to ${zipPath}...`);

      const file = storage.bucket('zproxy-mysql-backups').file(title);
      // Проверка на существование файла в бакете
      const [exists] = await file.exists();
      if (!exists) {
        console.error(`File ${title} not found.`);
        return { success: false, message: 'File not found.' };
      }

      // Скачивание файла
      await file.download(options);

      console.log(`Download complete for ${title}. Checking file size...`);

      // Проверка размера файла
      const stats = await fsp.stat(zipPath);
      if (stats.size === 0) {
        console.error(`Файл ${title} скачан, но пуст.`);
        return { success: false, message: 'Файл пуст после скачивания.' };
      }

      console.log(`Extracting ${zipPath}...`);
      await extractZipToFolder(zipPath);
      await fsp.unlink(zipPath);

      console.log(`Extraction complete and zip file removed for ${title}.`);
      return { success: true };
    } catch (error) {
      console.error('Error getting file from bucket:', error);
      return { success: false, message: 'Failed to download file.' };
    }
  }

  const getExtensionsFromDir = async (dir: string): Promise<string[]> => {
    try {
      const dirExists = await fsp
        .access(dir)
        .then(() => true)
        .catch(() => false);

      if (!dirExists) {
        console.error('Directory does not exist:', dir);
        return [];
      }

      const files = await fsp.readdir(dir);
      return files;
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  };

  async function loadExtensions(
    userExtensions: {
      id: string;
      external_id: string;
      url: string;
      is_public: boolean;
      title: string;
    }[],
    dir: string,
    browserParams: {
      version: string;
      naclArch: string;
    },
  ) {
    try {
      await ensureExtensionsDirectoryExists();
      const extensionDirs = await fsp.readdir(dir);

      if (!userExtensions?.length) return;
      for (const { id, external_id, is_public, title } of userExtensions) {
        const folderExists = extensionDirs.includes(is_public ? external_id : id);
        if (folderExists) {
          return;
        }
        if (!is_public) {
          await getExtensionBucketByUrl(title, external_id);
        } else {
          const downloadUrl = generateCrxDownloadUrl(
            id,
            browserParams.version,
            browserParams.naclArch,
          );
          await downloadAndExtractExtension(downloadUrl, id);
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке директорий:', error);
    }
  }

  const updateChromiumParams = async (
    chromiumParams: string[],
    profileParams: { [key: string]: any },
    userExtensionIds: {
      id: string;
      external_id: string;
      url: string;
      is_public: boolean;
      title: string;
    }[],
    browserParams: { version: string; naclArch: string },
  ): Promise<string[]> => {
    const userDataPath = getProfilesPath();
    const extensionsPath = getExtensionsPath();

    const updatedChromiumParams = [...chromiumParams];

    updatedChromiumParams.push(
      `--user-data-dir=${userDataPath}/prof${profileParams.title}_${profileParams.external_id}`,
    );
    updatedChromiumParams.push(
      `--m-profile-name=prof${profileParams.title}_${profileParams.external_id}`,
    );

    // Формируем строку с путями к расширениям
    let extensionPaths = userExtensionIds
      .map((extension) => {
        if (extension.is_public) {
          return `${userDataPath}/extensions/${extension.id}`;
        } else {
          return `${userDataPath}/extensions/${extension.external_id}`;
        }
      })
      .join(',');

    // Добавляем путь к WebRTC расширению
    const webRtcExtensionPath = `${userDataPath}/prof${profileParams.title}_${profileParams.external_id}/Default/Extensions/bkmmlbllpjdpgcgdohbaghfaecnddhni/0.2.2_0/`;
    extensionPaths += `,${webRtcExtensionPath}`;

    // Загружаем расширения, если они есть
    if (userExtensionIds.length) {
      await loadExtensions(userExtensionIds, extensionsPath, browserParams);
    }

    updatedChromiumParams.push(`--load-extension=${extensionPaths}`);
    return updatedChromiumParams;
  };

  // Handle Chromium actions
  ipcMain.on(
    'openChromium',
    async (
      i,
      chromiumParams,
      proxyParams,
      processId,
      profileParams,
      extensionsIds,
      browserParams,
    ) => {
      let proxyTunnel: any;
      try {
        proxyTunnel = execFile(getTunnelFilePath(), proxyParams);
        console.log('pidTunnel', proxyTunnel.pid);
      } catch (error) {
        console.log('open tunnel error', error);
        if (error instanceof Error) {
          new Notification({
            title: 'Open tunnel file error occurred',
            body: `${error.message} stack:${error.stack} + ${getTunnelFilePath()}`,
          }).show();
        }
      } finally {
        try {
          let uniquePort: number = 9222;
          do {
            uniquePort = 9222 + Math.floor(Math.random() * (9999 - 9222 + 1));
          } while (isPortInUse(uniquePort));

          const profileFolderName = `prof${profileParams.title}_${profileParams.external_id}`;
          const profileFolderPath = `${getProfilesPath()}/${profileFolderName}`;

          if (!fs.existsSync(profileFolderPath)) {
            console.log('Creating profile folder!');
            const sourceFolderPath = getProfileTemplatePath();
            await fs.promises.mkdir(profileFolderPath, { recursive: true });
            await copyFolderRecursive(sourceFolderPath, profileFolderPath);

            const cookiesFilePath = `${profileFolderPath}/cookiesInjectDump/cookies.json`;
            try {
              const jsonParsed = JSON.parse(profileParams.cookies);
              await fs.writeFileSync(cookiesFilePath, profileParams.cookies);
            } catch {
              await fs.writeFileSync(cookiesFilePath, '[]');
            }
          }

          let usingChromiumParams = [...chromiumParams, `--remote-debugging-port=${uniquePort}`];
          console.log('uniquePort', uniquePort);
          chromiumParams = await updateChromiumParams(
            usingChromiumParams,
            profileParams,
            extensionsIds,
            browserParams,
          );
          console.log('chromiumParams', chromiumParams);

          const chromiumProcessExecFile = await execFile(getChromiumBinaryPath(), chromiumParams);
          chromiumProcesses.push({
            title: profileParams.title,
            pidChrom: chromiumProcessExecFile.pid,
            port: uniquePort,
            external_id: profileParams.external_id,
          });
          console.log('chromiumProcesses', chromiumProcesses);

          const tempFilePath = `${getProfilesPath()}/prof${profileParams.title}_${
            profileParams.external_id
          }/cookiesInjectDump/cookies.json`;
          const dumpArgs = ['-chrome', `ws://127.0.0.1:${uniquePort}`, '-dump', tempFilePath];

          if (win && chromiumProcessExecFile.pid && processId) {
            try {
              const cookies = JSON.parse(profileParams.cookies);
              setTimeout(() => {
                const injectArgs = [
                  '-chrome',
                  `ws://127.0.0.1:${uniquePort}`,
                  '-inject',
                  tempFilePath,
                ];

                execFile(getCookieBinaryPath(), injectArgs, (error, stdout, stderr) => {
                  if (error) {
                    console.error('Error executing command:', error);
                  } else {
                    console.log('Cookies inject successfully!');
                  }
                });
              }, 2000);
            } catch {
              fs.writeFileSync(tempFilePath, '[]');
              console.log('Cookies are not valid!');
            }
            // win.webContents.send(`disableLoader_${processId}`, {itemId: processId});
            win.webContents.send('processPid', chromiumProcessExecFile.pid, processId);
          }

          const chromeCloseInterval = setInterval(async () => {
            try {
              const response = await fetch(`http://127.0.0.1:${uniquePort}/json`);
              const result = await response.json();

              if (result.length === 0) {
                console.log('Close chrome!');
                if (chromiumProcessExecFile.pid) {
                  process.kill(chromiumProcessExecFile.pid);
                } else {
                  console.error('Error: chromiumProcessExecFile.pid is undefined.');
                }
              } else {
                console.log('Chrome has a data!');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }, 2000);

          const cookieInterval = setInterval(async () => {
            execFile(getCookieBinaryPath(), dumpArgs, async (error, stdout, stderr) => {
              if (error) {
                console.error('Error executing command:', error);
              } else {
                console.log('Cookies dump to json successfully!');
              }
            });
          }, 10000);

          chromiumProcessExecFile.on('close', (code, signal) => {
            console.log(
              `Chromium process on port ${uniquePort} exited with code ${code} and signal ${signal}`,
            );
            clearInterval(cookieInterval);
            clearInterval(chromeCloseInterval);
            if (
              chromiumProcesses.find(
                (chromiumProcess) => chromiumProcess.pidChrom === chromiumProcessExecFile.pid,
              )
            ) {
              chromiumProcesses = chromiumProcesses.filter(
                (chromiumProcess) => chromiumProcess.pidChrom !== chromiumProcessExecFile.pid,
              );
            }
            if (proxyTunnel) {
              proxyTunnel.kill();
            }
            readFile(tempFilePath, 'utf-8', (err, cookies) => {
              if (err) {
                console.log('Error reading file:', err);
                win?.webContents.send('getCookies', {
                  cookies: profileParams.cookies,
                  profileParams: profileParams,
                });
                // fs.unlinkSync(tempFilePath);
              } else {
                console.log('File cookies content:', cookies);
                win?.webContents.send('getCookies', {
                  cookies: cookies,
                  profileParams: profileParams,
                });
                console.log('Cookies imported to api file successfully!');
                // fs.unlinkSync(tempFilePath);
              }
            });
          });
        } catch (error) {
          if (error instanceof Error) {
            new Notification({
              title: 'Open Chromium error',
              body: `${error.message} stack:${error.stack} + ${getChromiumBinaryPath()}`,
            }).show();
          }
        }
      }
    },
  );

  // Kill process
  ipcMain.on('killProcess', (i, pidProcess) => {
    try {
      if (chromiumProcesses.find((chromiumProcess) => chromiumProcess.pidChrom === pidProcess)) {
        chromiumProcesses = chromiumProcesses.filter(
          (chromiumProcess) => chromiumProcess.pidChrom !== pidProcess,
        );
        process.kill(pidProcess);
        console.log(`Process ${pidProcess} has been killed`);
      }
    } catch (err) {
      console.error(`Could not kill process ${pidProcess}: `, err);
    }
  });

  // Download profile mass import template
  ipcMain.on('downloadFile', (i) => {
    const filePath = getMassImportTemplate();
    const fileName = 'Import-template-anty-code.xlsx';
    const defaultPath = path.join?.(app.getPath('downloads'), fileName);
    let savePath: any = dialog.showSaveDialogSync({
      title: 'Save File',
      defaultPath: defaultPath,
    });

    if (savePath) {
      // Check if the file already exists
      let index = 1;
      while (fs.existsSync(savePath)) {
        const ext = path.extname?.(savePath);
        const baseName = path.basename?.(fileName, ext);
        const newName = `${baseName} (${index})${ext}`;
        if (savePath != null) {
          savePath = dialog.showSaveDialogSync({
            title: 'Save File',
            defaultPath: path.join?.(<string>path.dirname?.(savePath), newName),
          });
        }
        index++;
      }

      try {
        fs.copyFileSync(filePath, savePath);
        win?.webContents.send('xlsxFilePath', { savePath });
      } catch (error) {
        console.error('Error copying file:', error);
      }
    }
  });

  //Check proxy
  ipcMain.on('checkProxyInProfileForm', (i, proxyParams) => {
    try {
      // Вывод данных прокси в терминал
      console.log('proxyParams', proxyParams);

      // Процесс туннелирования
      const tunnelProcess = execFile(getTunnelFilePath(), [
        `-L=http://:${proxyParams?.port}`,
        `-F=${proxyParams?.type}://${proxyParams?.login}:${proxyParams?.password}@${proxyParams?.host}:${proxyParams?.port}`,
      ]);
      // win?.webContents.send('tunnelProcessPid', tunnelProcess.pid);

      // Работа с api
      setTimeout(async () => {
        // Агент
        const agent = new HttpsProxyAgent(`http://127.0.0.1:${proxyParams?.port}`);

        // Запрос для получения данных по прокси
        let data = ''; // В данной переменной будут засетены данные по прокси
        const req = await https.get(
          'https://europe-west2-hallowed-grin-348617.cloudfunctions.net/geolocation',
          { agent },
          (res) => {
            res.on('data', (chunk) => {
              data += chunk;
            });

            // Ивент, срабатывающий по окончанию работы запроса
            res.on('end', () => {
              win?.webContents.send('checkProxyInProfileFormResult', {
                result: data,
              });
              tunnelProcess.kill();
            });
            res.pipe(process.stdout);
          },
        );

        // Вывод ошибки по запросу для получения данных прокси
        await req.on('error', (err) => {
          if (data.length > 0) {
            win?.webContents.send('checkProxyInProfileFormResult', {
              result: data,
            });
            tunnelProcess.kill();
          } else {
            console.error('HTTP request error CheckProxy:', err);
            win?.webContents.send('checkProxyInProfileFormResult', {
              result: 'requestError',
            });
            tunnelProcess.kill();
          }
        });

        // Вывод ошибки - процесс туннелирования
        await tunnelProcess.on('error', (err) => {
          console.error('Tunnel process error:', err);
          win?.webContents.send('checkProxyInProfileFormResult', {
            result: 'requestError',
          });
          tunnelProcess.kill();
        });
      }, 1000);
    } catch (error) {
      console.log('Catch error: ', error);
    }
  });

  let checkSingleProxyProcesses: any[] = [];
  ipcMain.on('checkSingleProxy', (i, proxyParams) => {
    try {
      // Вывод данных прокси в терминал
      console.log('proxyParams', proxyParams);

      // Процесс туннелирования
      const tunnelProcess = execFile(getTunnelFilePath(), [
        `-L=http://:${proxyParams?.port}`,
        `-F=${proxyParams?.type}://${proxyParams?.login}:${proxyParams?.password}@${proxyParams?.host}:${proxyParams?.port}`,
      ]);
      checkSingleProxyProcesses.push({ [proxyParams.external_id]: tunnelProcess });
      // win?.webContents.send('tunnelProcessPid', tunnelProcess.pid);

      // Работа с api
      setTimeout(async () => {
        // Агент
        const agent = new HttpsProxyAgent(`http://127.0.0.1:${proxyParams?.port}`);

        // Запрос для получения данных по прокси
        let data = ''; // В данной переменной будут засетены данные по прокси
        const req = await https.get(
          'https://europe-west2-hallowed-grin-348617.cloudfunctions.net/geolocation',
          { agent },
          (res) => {
            res.on('data', (chunk) => {
              data += chunk;
            });

            // Ивент, срабатывающий по окончанию работы запроса
            res.on('end', () => {
              win?.webContents.send(`checkSingleProxyResult_${proxyParams.external_id}`, {
                result: data,
                speed: null,
                proxyData: proxyParams,
              });
              if (proxyParams.checkFromProfilesPage) {
                tunnelProcess.kill();
              }
            });
            res.pipe(process.stdout);
          },
        );

        // Вывод ошибки по запросу для получения данных прокси
        await req.on('error', (err) => {
          if (data.length > 0) {
            win?.webContents.send(`checkSingleProxyResult_${proxyParams.external_id}`, {
              result: data,
              speed: null,
              proxyData: proxyParams,
            });
            if (proxyParams.checkFromProfilesPage) {
              tunnelProcess.kill();
            }
          } else {
            console.error('HTTP request error CheckProxy:', err);
            for (const processObj of checkSingleProxyProcesses) {
              const key = Object.keys(processObj)[0];
              if (key === proxyParams.external_id) {
                const currentTunnelProcess = processObj[key];
                if (currentTunnelProcess) {
                  currentTunnelProcess.kill();
                  checkSingleProxyProcesses = checkSingleProxyProcesses.filter(
                    (obj) => obj !== processObj,
                  );
                }
              }
            }
            win?.webContents.send(`checkSingleProxyResult_${proxyParams.external_id}`, {
              result: 'requestError',
              speed: null,
              proxyData: proxyParams,
            });
          }
        });

        // Вывод ошибки - процесс туннелирования
        await tunnelProcess.on('error', (err) => {
          console.error('Tunnel process error:', err);
          for (const processObj of checkSingleProxyProcesses) {
            const key = Object.keys(processObj)[0];
            if (key === proxyParams.external_id) {
              const currentTunnelProcess = processObj[key];
              if (currentTunnelProcess) {
                currentTunnelProcess.kill();
                checkSingleProxyProcesses = checkSingleProxyProcesses.filter(
                  (obj) => obj !== processObj,
                );
              }
            }
          }
          win?.webContents.send(`checkSingleProxyResult_${proxyParams.external_id}`, {
            result: 'requestError',
            speed: null,
            proxyData: proxyParams,
          });
        });
      }, 1000);
    } catch (error) {
      console.log('Catch error: ', error);
    }
  });

  ipcMain.on('checkSingleProxySpeed', (i, proxyParams) => {
    console.log('proxyParams for check proxy speed: ', proxyParams);
    const agent = new HttpsProxyAgent(`http://127.0.0.1:${proxyParams?.port}`);
    const fileSize = 80; // Размер файла в Мбит (1MB = 8 Мбит) , файл 10MB
    const coefficientForSpeed = 1.5; // Коэффициент

    // Записываем время начала загрузки при получении первого куска данных
    let downloadStart = performance.now();

    // Запрос для вычисления скорости
    const reqSpeed = https.get('https://anty-code.com/speedtest.bin', { agent }, (resSpeed) => {
      // dataSpeed мы не используем никак. Ивент 'data' нужен для инициирования ивента 'end'.
      let dataSpeed = '';

      resSpeed.on('data', (chunk) => {
        dataSpeed += chunk;
      });

      // Ивент, срабатывающий по окончанию работы запроса
      resSpeed.on('end', () => {
        const downloadEnd = performance.now(); // Фиксируется завершение запроса

        // Деление на 1000 нужно для преобразования времени из миллисекунд в секунды
        // durationInSeconds - время за которое отработал запрос
        const durationInSeconds = (downloadEnd - downloadStart) / 1000;
        console.log(`Событие 'end' обработано за ${durationInSeconds} секунд`);

        // Скорость в Мбит/с . toFixed() нужен для форматирования числа после точки
        const speed = ((fileSize / durationInSeconds) * coefficientForSpeed).toFixed(2);
        console.log('Скорость загрузки:', speed, 'Мбит/с');
        for (const processObj of checkSingleProxyProcesses) {
          const key = Object.keys(processObj)[0];
          if (key === proxyParams.external_id) {
            const currentTunnelProcess = processObj[key];
            if (currentTunnelProcess) {
              currentTunnelProcess.kill();
              checkSingleProxyProcesses = checkSingleProxyProcesses.filter(
                (obj) => obj !== processObj,
              );
            }
          }
        }
        win?.webContents.send(`checkSingleProxySpeedResult_${proxyParams.external_id}`, {
          speed: speed,
          proxyData: proxyParams,
        });
      });
    });
    // Вывод ошибки по запросу для получения скорости
    reqSpeed.on('error', (err) => {
      console.error('HTTP request error speed test:', err);
      for (const processObj of checkSingleProxyProcesses) {
        const key = Object.keys(processObj)[0];
        if (key === proxyParams.external_id) {
          const currentTunnelProcess = processObj[key];
          if (currentTunnelProcess) {
            currentTunnelProcess.kill();
            checkSingleProxyProcesses = checkSingleProxyProcesses.filter(
              (obj) => obj !== processObj,
            );
          }
        }
      }
      win?.webContents.send(`proxyCheckSpeedResult_${proxyParams.external_id}`, {
        speed: null,
        proxyData: proxyParams,
      });
    });
  });

  let checkProxiesProcesses: any[] = [];
  ipcMain.on('checkProxy', (i, proxyParams) => {
    try {
      // Вывод данных прокси в терминал
      console.log('proxyParams', proxyParams);

      // Процесс туннелирования
      const tunnelProcess = execFile(getTunnelFilePath(), [
        `-L=http://:${proxyParams?.port}`,
        `-F=${proxyParams?.type}://${proxyParams?.login}:${proxyParams?.password}@${proxyParams?.host}:${proxyParams?.port}`,
      ]);
      checkProxiesProcesses.push({ [proxyParams.external_id]: tunnelProcess });

      // win?.webContents.send('tunnelProcessPid', tunnelProcess.pid);

      // Работа с api
      setTimeout(async () => {
        // Агент
        const agent = new HttpsProxyAgent(`http://127.0.0.1:${proxyParams?.port}`);

        // Запрос для получения данных по прокси
        let data = ''; // В данной переменной будут засетены данные по прокси
        const req = await https.get(
          'https://europe-west2-hallowed-grin-348617.cloudfunctions.net/geolocation',
          { agent },
          (res) => {
            res.on('data', (chunk) => {
              data += chunk;
            });

            // Ивент, срабатывающий по окончанию работы запроса
            res.on('end', () => {
              win?.webContents.send(`proxyCheckResult_${proxyParams.external_id}`, {
                result: data,
                speed: null,
                proxyData: proxyParams,
              });
            });
            res.pipe(process.stdout);
          },
        );

        // Вывод ошибки по запросу для получения данных прокси
        await req.on('error', async (err) => {
          if (data.length > 0) {
            win?.webContents.send(`proxyCheckResult_${proxyParams.external_id}`, {
              result: data,
              speed: null,
              proxyData: proxyParams,
            });
          } else {
            console.error('HTTP request error CheckProxy:', err);
            for (const processObj of checkProxiesProcesses) {
              const key = Object.keys(processObj)[0];
              if (key === proxyParams.external_id) {
                const currentTunnelProcess = processObj[key];
                if (currentTunnelProcess) {
                  currentTunnelProcess.kill();
                  checkProxiesProcesses = checkProxiesProcesses.filter((obj) => obj !== processObj);
                }
              }
            }
            win?.webContents.send(`proxyCheckResult_${proxyParams.external_id}`, {
              result: 'requestError',
              speed: null,
              proxyData: proxyParams,
            });
          }
        });

        // Вывод ошибки - процесс туннелирования
        await tunnelProcess.on('error', (err) => {
          console.error('Tunnel process error:', err);
          for (const processObj of checkProxiesProcesses) {
            const key = Object.keys(processObj)[0];
            if (key === proxyParams.external_id) {
              const currentTunnelProcess = processObj[key];
              if (currentTunnelProcess) {
                currentTunnelProcess.kill();
                checkProxiesProcesses = checkProxiesProcesses.filter((obj) => obj !== processObj);
              }
            }
          }
          win?.webContents.send(`proxyCheckResult_${proxyParams.external_id}`, {
            result: 'requestError',
            speed: null,
            proxyData: proxyParams,
          });
        });
      }, 1000);
    } catch (error) {
      console.log('Catch error: ', error);
    }
  });

  ipcMain.on('checkProxySpeed', (i, proxyParams) => {
    console.log('proxyParams for check proxy speed: ', proxyParams);
    const agent = new HttpsProxyAgent(`http://127.0.0.1:${proxyParams?.port}`);
    const fileSize = 80; // Размер файла в Мбит (1MB = 8 Мбит) , файл 10MB
    const coefficientForSpeed = 1.5; // Коэффициент

    // Записываем время начала загрузки при получении первого куска данных
    let downloadStart = performance.now();

    // Запрос для вычисления скорости
    const reqSpeed = https.get('https://anty-code.com/speedtest.bin', { agent }, (resSpeed) => {
      // dataSpeed мы не используем никак. Ивент 'data' нужен для инициирования ивента 'end'.
      let dataSpeed = '';

      resSpeed.on('data', (chunk) => {
        dataSpeed += chunk;
      });

      // Ивент, срабатывающий по окончанию работы запроса
      resSpeed.on('end', () => {
        const downloadEnd = performance.now(); // Фиксируется завершение запроса

        // Деление на 1000 нужно для преобразования времени из миллисекунд в секунды
        // durationInSeconds - время за которое отработал запрос
        const durationInSeconds = (downloadEnd - downloadStart) / 1000;
        console.log(`Событие 'end' обработано за ${durationInSeconds} секунд`);

        // Скорость в Мбит/с . toFixed() нужен для форматирования числа после точки
        const speed = ((fileSize / durationInSeconds) * coefficientForSpeed).toFixed(2);
        console.log('Скорость загрузки:', speed, 'Мбит/с');
        for (const processObj of checkProxiesProcesses) {
          const key = Object.keys(processObj)[0];
          if (key === proxyParams.external_id) {
            const currentTunnelProcess = processObj[key];
            if (currentTunnelProcess) {
              currentTunnelProcess.kill();
              checkProxiesProcesses = checkProxiesProcesses.filter((obj) => obj !== processObj);
            }
          }
        }
        win?.webContents.send(`proxyCheckSpeedResult_${proxyParams.external_id}`, {
          speed: speed,
          proxyData: proxyParams,
        });
      });
    });

    // Вывод ошибки по запросу для получения скорости
    reqSpeed.on('error', (err) => {
      console.error('HTTP request error speed test:', err);
      for (const processObj of checkProxiesProcesses) {
        const key = Object.keys(processObj)[0];
        if (key === proxyParams.external_id) {
          const currentTunnelProcess = processObj[key];
          if (currentTunnelProcess) {
            currentTunnelProcess.kill();
            checkProxiesProcesses = checkProxiesProcesses.filter((obj) => obj !== processObj);
          }
        }
      }
      win?.webContents.send(`proxyCheckSpeedResult_${proxyParams.external_id}`, {
        speed: null,
        proxyData: proxyParams,
      });
    });
  });
}

ipcMain.handle(
  'upload-file-to-bucket',
  async (event, fileBuffer: ArrayBuffer, fileName: string) => {
    const appPath = getAppPath();

    const tempFilePath = path.join(appPath, `upload-${Date.now()}.zip`);

    try {
      await fsp.writeFile(tempFilePath, Buffer.from(fileBuffer));

      const response = await bucket.upload(tempFilePath, {
        destination: fileName,
        gzip: true,
      });

      const mediaLink = response[0]?.metadata?.mediaLink;

      await fsp.unlink(tempFilePath);

      return mediaLink;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
);

ipcMain.handle('fetch-extension-icon', async (event, extensionUrl) => {
  try {
    // Load the HTML page
    const { data: html } = await axios.get(extensionUrl);

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);

    // Find the image
    const iconElement = $('img[jscontroller="OhgRI"]').first();
    const iconUrl = iconElement.attr('src') || iconElement.attr('data-src');

    // Find the <h1> title
    const titleElement = $('h1').first();
    const title = titleElement.text();

    return {
      iconUrl: iconUrl || null,
      title: title || null,
    };
  } catch (error) {
    console.error('Error parsing data:', error);
    return { iconUrl: null, title: null };
  }
});

const rootDir = path.resolve(__dirname, '../../');
const extensionsDir = path.join(rootDir, 'extensions');

async function extractZipToFolder(zipPath: string) {
  const folderName = path.basename(zipPath, path.extname(zipPath));
  const outputDir = path.join(path.dirname(zipPath), folderName);

  try {
    // Асинхронно создаём директорию, если её не существует
    console.log(`Trying to create output directory: ${outputDir}`);
    await fsp.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
    throw new Error(`Failed to create output directory: ${outputDir}`);
  }

  console.log(`Starting extraction of ${zipPath} to ${outputDir}`);

  try {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) throw err;

      zipfile.readEntry();
      zipfile.on('entry', async (entry) => {
        const entryPath = path.join(outputDir, entry.fileName);

        if (entry.fileName.endsWith('/')) {
          try {
            await fsp.mkdir(entryPath, { recursive: true }); // Асинхронное создание директории
            zipfile.readEntry();
          } catch (err) {
            console.error('Error creating directory:', err);
            throw err;
          }
        } else {
          try {
            await fsp.mkdir(path.dirname(entryPath), { recursive: true }); // Асинхронное создание директорий для файлов
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) throw err;
              const writeStream = fs.createWriteStream(entryPath); // Обычный fs для синхронной записи файла
              readStream.pipe(writeStream);
              writeStream.on('finish', () => {
                zipfile.readEntry();
              });
            });
          } catch (err) {
            console.error('Error creating file directory:', err);
            throw err;
          }
        }
      });

      zipfile.on('end', () => {
        console.log(`Extraction completed successfully to ${outputDir}`);
      });
    });
  } catch (error: any) {
    console.error('Error during extraction:', error.message);
    throw new Error('Failed to extract ZIP file');
  }
}

const ensureExtensionsDirectoryExists = async () => {
  const extensionsDir = getExtensionsPath();

  try {
    // Проверяем, существует ли директория
    await fsp.access(extensionsDir);
    console.log(`Directory exists: ${extensionsDir}`);
  } catch (error) {
    // Если директория не существует, создаём её рекурсивно
    console.log(`Directory does not exist: ${extensionsDir}, creating...`);
    await fsp.mkdir(extensionsDir, { recursive: true });
    console.log(`Directory created successfully: ${extensionsDir}`);
  }
};

ipcMain.handle('download-extension', async (event, downloadUrl: string, extensionId: string) => {
  try {
    const result = await downloadAndExtractExtension(downloadUrl, extensionId);

    return result;
  } catch (error: any) {
    console.error('Error during download or extraction:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle(
  'download-extension-by-file',
  async (event: IpcMainInvokeEvent, fileBuffer: ArrayBuffer, extensionId: string) => {
    try {
      await ensureExtensionsDirectoryExists();
      const extensionsDir = getExtensionsPath();
      const zipPath = path.join(extensionsDir, `${extensionId}.zip`);
      const buffer = Buffer.from(fileBuffer);
      await fsp.writeFile(zipPath, buffer);
      await extractZipToFolder(zipPath);
      await fsp.unlink(zipPath);
      return { success: true };
    } catch (error: any) {
      console.error('Error during download or conversion:', error);
      return { success: false, error: error.message };
    }
  },
);

async function downloadAndExtractExtension(downloadUrl: string, extensionId: string) {
  try {
    await ensureExtensionsDirectoryExists(); // Проверка и создание директории

    const extensionsDir = getExtensionsPath();
    const extensionPath = path.join(extensionsDir, `${extensionId}.crx`);
    const zipPath = path.join(extensionsDir, `${extensionId}.zip`);

    // Скачиваем CRX файл
    await downloadCrxFile(downloadUrl, extensionPath);

    // Конвертируем CRX файл в ZIP архив
    await convertCrxToZip(extensionPath, zipPath);

    // Извлекаем файлы из ZIP архива
    await extractZipToFolder(zipPath);

    // Удаляем временные файлы
    await fsp.unlink(extensionPath); // Асинхронное удаление файла
    await fsp.unlink(zipPath); // Асинхронное удаление файла

    return { success: true, path: zipPath };
  } catch (error: any) {
    console.error('Error during download or conversion:', error);
    return { success: false, error: error.message };
  }
}

async function downloadCrxFile(url: string, filePath: string) {
  console.log(`'Starting download from URL': ${url}`);

  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    console.log(`Received response with status: ${response.status}`);

    if (response.status !== 200) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        console.log('CRX file downloaded and saved successfully.');
        resolve();
      });
      writer.on('error', (error: Error) => {
        console.error('Error during file write:', error.message);
        reject(new Error('Failed to write CRX file'));
      });
    });
  } catch (error: any) {
    console.error('Error during download:', error.message);
    throw new Error('Failed to download CRX file');
  }
}

function extractCrxPayload(crxBuffer: Buffer): Buffer {
  const version = crxBuffer.readUInt32LE(4); // Читаем версию CRX файла

  if (version === 2) {
    // CRX v2: Извлекаем длины блоков публичного ключа и подписи
    const publicKeyLength = crxBuffer.readUInt32LE(8);
    const signatureLength = crxBuffer.readUInt32LE(12);

    // Рассчитываем общий размер заголовка
    const totalHeaderSize = 16 + publicKeyLength + signatureLength;

    // Извлекаем полезную нагрузку
    return crxBuffer.slice(totalHeaderSize);
  } else if (version === 3) {
    // CRX v3: Извлекаем длину заголовка
    const headerLength = crxBuffer.readUInt32LE(8);

    // Рассчитываем общий размер заголовка для v3
    const totalHeaderSize = 12 + headerLength;

    // Извлекаем полезную нагрузку
    return crxBuffer.slice(totalHeaderSize);
  } else {
    throw new Error(`Unsupported CRX version: ${version}`);
  }
}

async function convertCrxToZip(crxPath: string, zipPath: string) {
  console.log(`Starting conversion from ${crxPath} to ${zipPath}`);

  if (!fs.existsSync(crxPath)) {
    throw new Error(`CRX file does not exist at path: ${crxPath}`);
  }

  try {
    const crxBuffer = fs.readFileSync(crxPath);

    if (crxBuffer.length === 0) {
      throw new Error('CRX file is empty or corrupted');
    }

    console.log('CRX file loaded successfully. Starting extraction...');

    // Проверяем версию CRX файла
    const version = crxBuffer.readUInt32LE(4);
    if (version !== 2 && version !== 3) {
      throw new Error(`Unsupported CRX version: ${version}`);
    }

    // Извлекаем полезную нагрузку из CRX
    const zipPayload = extractCrxPayload(crxBuffer);

    // Создаем ZIP из полезной нагрузки
    const extractedZip = new AdmZip(zipPayload);

    // Сохраняем как ZIP файл
    extractedZip.writeZip(zipPath);

    console.log('Conversion to ZIP completed successfully.');
  } catch (error: any) {
    console.error('Error during conversion:', error.message);
    throw new Error('Failed to convert CRX file to ZIP');
  }
}

ipcMain.handle(
  'delete-extension-file',
  async (event, extensionId: string[], external_id: string[]) => {
    const extensionsDirPath = getExtensionsPath();
    const extensionPathUrl = path.join(extensionsDirPath, extensionId);
    const extensionPathFile = path.join(extensionsDirPath, external_id);
    console.log('delete-extension-file extensionsDirPath', extensionsDirPath);
    console.log('delete-extension-file extensionPath', extensionPathUrl);
    console.log('delete-extension-file extensionPath', extensionPathFile);
    try {
      if (fs.existsSync(extensionPathFile)) {
        // Рекурсивно удаляем содержимое директории
        deleteDirectoryRecursive(extensionPathFile);
        console.log(`Extension ${external_id} deleted successfully from disk.`);
        return { success: true };
      } else if (fs.existsSync(extensionPathUrl)) {
        deleteDirectoryRecursive(extensionPathUrl);
        console.log(`Extension ${extensionId} deleted successfully from disk.`);
        return { success: true };
      } else {
        console.log(`Extension ${external_id} not found on disk.`);
        return { success: false, error: 'File not found' };
      }
    } catch (error: any) {
      console.error('Error deleting extension file:', error);
      return { success: false, error: 'Failed to delete file' };
    }
  },
);

// Функция для рекурсивного удаления директории и ее содержимого
function deleteDirectoryRecursive(directoryPath: string) {
  if (fs.existsSync(directoryPath)) {
    // Получаем список всех файлов и папок в директории
    const files = fs.readdirSync(directoryPath);

    // Удаляем все файлы и поддиректории
    for (const file of files) {
      const currentPath = path.join(directoryPath, file);
      if (fs.statSync(currentPath).isDirectory()) {
        // Если это директория, рекурсивно вызываем функцию для удаления
        deleteDirectoryRecursive(currentPath);
      } else {
        // Если это файл, удаляем его
        fs.unlinkSync(currentPath);
      }
    }

    // Удаляем саму директорию
    fs.rmdirSync(directoryPath);
  }
}

app.on('browser-window-focus', function () {
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled');
  });
  globalShortcut.register('F5', () => {
    console.log('F5 is pressed: Shortcut Disabled');
  });
});

app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('F5');
});

app.on('window-all-closed', () => {
  win = null;
  app.quit();
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
